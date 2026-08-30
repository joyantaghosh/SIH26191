import { Settlement, seedSettlements } from './settlement.model.js';
import { ApiError } from '../../common/utils/ApiError.js';
import { httpStatusCodes } from '../../common/constants/httpStatusCodes.js';
import mongoose from 'mongoose';

export async function ensureSeedData() {
  const count = await Settlement.countDocuments();
  if (count === 0) {
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
