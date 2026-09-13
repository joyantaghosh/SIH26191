import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Settlement, seedSettlements } from './settlement.model.js';
import { ApiError } from '../../common/utils/ApiError.js';
import { httpStatusCodes } from '../../common/constants/httpStatusCodes.js';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ML_ZONES_PATH = path.resolve(__dirname, '../../../../ml-proxy/outputs/data/riskZones.json');

export async function ensureSeedData() {
  const count = await Settlement.countDocuments();
  if (count === 0) {
    if (fs.existsSync(ML_ZONES_PATH)) {
      try {
        const raw = fs.readFileSync(ML_ZONES_PATH, 'utf-8');
        const list = JSON.parse(raw);
        if (Array.isArray(list) && list.length > 0) {
          const settlements = list.map((z, idx) => {
            const r = (z.riskLevel || 'warning').toLowerCase();
            const riskLevel = r === 'critical' || r === 'high' ? 'Critical' : r === 'safe' ? 'Safe' : 'Warning';
            const vuln = Math.round(
              (typeof z.vulnerabilityScore === 'number' && z.vulnerabilityScore <= 1
                ? z.vulnerabilityScore * 100
                : z.vulnerabilityScore) || 50
            );
            return {
              settlementId: `SETTL-${idx + 1001}`,
              name: z.name.replace(/Multi-Hazard Active Disaster Zone/i, 'Sector').trim(),
              district: z.region ? z.region.split(',')[0].trim() : 'District Zone',
              riskLevel,
              population: z.population || 5000,
              vulnerabilityScore: vuln,
              hazardType: (z.hazardTypes && z.hazardTypes[0]) || 'Landslide',
              distanceToHazardKm: 1.5,
              routeStatus: riskLevel === 'Critical' ? 'Compromised' : 'Clear',
              progress: Math.max(15, 100 - vuln),
              location: z.center || { type: 'Point', coordinates: [78.96, 20.59] },
              mapPlacement: {
                top: `${Math.round(20 + (idx % 8) * 8)}%`,
                left: `${Math.round(15 + (idx % 7) * 11)}%`,
              },
              isActive: true,
            };
          });
          await Settlement.insertMany(settlements);
          console.log(`[seed:settlements] Inserted ${settlements.length} ML settlements`);
          return;
        }
      } catch (_) {}
    }
    await Settlement.insertMany(seedSettlements);
  }
}


export async function querySettlements(filterParams = {}) {
  await ensureSeedData();

  const { district, riskLevel, search, page = 1, limit = 50 } = filterParams;

  const query = { isActive: true };

  if (district && district !== 'All Districts') {
    query.district = district;
  }

  if (riskLevel && riskLevel !== 'all') {
    // case insensitive match for Critical, Warning, Safe
    query.riskLevel = new RegExp(`^${riskLevel}$`, 'i');
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { settlementId: { $regex: search, $options: 'i' } },
      { hazardType: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [settlements, total, districts] = await Promise.all([
    Settlement.find(query).sort({ vulnerabilityScore: -1 }).skip(skip).limit(Number(limit)).lean(),
    Settlement.countDocuments(query),
    Settlement.distinct('district', { isActive: true }),
  ]);

  return {
    settlements,
    districts: ['All Districts', ...districts],
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)) || 1,
    },
  };
}

export async function getSettlementById(identifier) {
  await ensureSeedData();

  const query = mongoose.isValidObjectId(identifier)
    ? { _id: identifier }
    : { settlementId: identifier.toUpperCase() };

  const settlement = await Settlement.findOne(query).lean();
  if (!settlement) {
    throw new ApiError(httpStatusCodes.NOT_FOUND, `Settlement "${identifier}" not found`);
  }

  return settlement;
}

export async function getSettlementSummaryStats() {
  await ensureSeedData();

  const settlements = await Settlement.find({ isActive: true }).lean();

  const total = settlements.length;
  const critical = settlements.filter((s) => s.riskLevel?.toLowerCase() === 'critical').length;
  const warning = settlements.filter((s) => s.riskLevel?.toLowerCase() === 'warning').length;
  const safe = settlements.filter((s) => s.riskLevel?.toLowerCase() === 'safe').length;
  const totalPopulation = settlements.reduce((acc, s) => acc + (s.population || 0), 0);
  const avgVulnerability =
    total > 0 ? Math.round(settlements.reduce((acc, s) => acc + (s.vulnerabilityScore || 0), 0) / total) : 0;

  return {
    totalSettlements: total,
    criticalCount: critical,
    warningCount: warning,
    safeCount: safe,
    totalPopulation,
    avgVulnerability,
  };
}

export async function createSettlement(payload) {
  const existing = await Settlement.findOne({ settlementId: payload.settlementId?.toUpperCase() });
  if (existing) {
    throw new ApiError(httpStatusCodes.CONFLICT, `Settlement ID ${payload.settlementId} already exists`);
  }

  return Settlement.create(payload);
}

export async function updateSettlement(identifier, payload) {
  const query = mongoose.isValidObjectId(identifier)
    ? { _id: identifier }
    : { settlementId: identifier.toUpperCase() };

  const updated = await Settlement.findOneAndUpdate(query, payload, { new: true, runValidators: true });
  if (!updated) {
    throw new ApiError(httpStatusCodes.NOT_FOUND, `Settlement "${identifier}" not found`);
  }

  return updated;
}

export async function deleteSettlement(identifier) {
  const query = mongoose.isValidObjectId(identifier)
    ? { _id: identifier }
    : { settlementId: identifier.toUpperCase() };

  const deleted = await Settlement.findOneAndUpdate(query, { isActive: false }, { new: true });
  if (!deleted) {
    throw new ApiError(httpStatusCodes.NOT_FOUND, `Settlement "${identifier}" not found`);
  }

  return deleted;
}

export default {
  ensureSeedData,
  querySettlements,
  getSettlementById,
  getSettlementSummaryStats,
  createSettlement,
  updateSettlement,
  deleteSettlement,
};
