import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { RiskZone } from './riskZone.model.js';
import { ApiError } from '../../common/utils/ApiError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ML_ZONES_PATH = path.resolve(__dirname, '../../../../ml-proxy/outputs/data/riskZones.json');

export async function ensureSeedData() {
  const count = await RiskZone.countDocuments();
  if (count === 0 && fs.existsSync(ML_ZONES_PATH)) {
    try {
      const raw = fs.readFileSync(ML_ZONES_PATH, 'utf-8');
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length > 0) {
        const zones = list.map((item) => {
          let hType = 'landslide';
          if (Array.isArray(item.hazardTypes) && item.hazardTypes.length > 0) {
            const first = item.hazardTypes[0].toLowerCase();
            hType = first.includes('flood') ? 'flood' : first.includes('earthquake') ? 'earthquake' : 'landslide';
          }
          let rLevel = (item.riskLevel || 'warning').toLowerCase();
          if (rLevel === 'moderate' || rLevel === 'medium') rLevel = 'warning';
          if (rLevel === 'high') rLevel = 'critical';
          if (!['critical', 'warning', 'safe'].includes(rLevel)) rLevel = 'warning';

          const coords = item.center?.coordinates || [76.13, 11.60];

          return {
            zoneId: item.zoneId,
            name: item.name,
            region: item.region || '',
            description: item.description || '',
            hazardType: hType,
            riskLevel: rLevel,
            vulnerabilityScore: Math.round(
              (typeof item.vulnerabilityScore === 'number' && item.vulnerabilityScore <= 1
                ? item.vulnerabilityScore * 100
                : item.vulnerabilityScore) || 50
            ),
            severityIndex: Math.min(10, Math.round(item.severityIndex || 5)),
            metrics: {
              severity: Math.round((item.severityIndex || 5) * 10),
              density: Math.min(100, Math.round((item.population || 50000) / 1000)),
              soilRisk: Math.round((item.vulnerabilityScore || 0.5) * 100),
            },
            population: item.population || 0,
            households: item.households || Math.round((item.population || 0) / 4),
            distanceToHazardKm: 1.5,
            center: {
              type: 'Point',
              coordinates: [coords[0], coords[1]],
            },
            radiusMeters: item.radiusMeters || 5000,
            isActive: true,
          };
        });

        await RiskZone.insertMany(zones);
        console.log(`[seed:riskZones] Inserted ${zones.length} ML risk zones`);
      }
    } catch (err) {
      console.warn('[seed:riskZones] Could not seed from ML data:', err.message);
    }
  }
}

const csv = (v) => String(v).split(',').map((s) => s.trim()).filter(Boolean);

const buildFilter = (q) => {
  const filter = {};
  if (q.isActive !== undefined) filter.isActive = q.isActive;
  else filter.isActive = true;

  if (q.riskLevel) filter.riskLevel = { $in: csv(q.riskLevel) };
  if (q.hazardType) filter.hazardType = { $in: csv(q.hazardType) };
  if (q.region) filter.region = new RegExp(`^${q.region}$`, 'i');

  if (q.minScore !== undefined || q.maxScore !== undefined) {
    filter.vulnerabilityScore = {};
    if (q.minScore !== undefined) filter.vulnerabilityScore.$gte = q.minScore;
    if (q.maxScore !== undefined) filter.vulnerabilityScore.$lte = q.maxScore;
  }

  if (q.q) {
    filter.$or = [
      { name: new RegExp(q.q, 'i') },
      { region: new RegExp(q.q, 'i') },
      { zoneId: new RegExp(q.q, 'i') },
    ];
  }

  // Viewport query — only load what the map can actually see
  if (q.bbox) {
    const [minLng, minLat, maxLng, maxLat] = csv(q.bbox).map(Number);
    filter.center = {
      $geoWithin: { $box: [[minLng, minLat], [maxLng, maxLat]] },
    };
  }

  // Proximity query — "zones near me"
  if (q.lat !== undefined && q.lng !== undefined) {
    filter.center = {
      $nearSphere: {
        $geometry: { type: 'Point', coordinates: [q.lng, q.lat] },
        $maxDistance: q.radius,
      },
    };
  }
  return filter;
};

export const queryRiskZones = async (q) => {
  await ensureSeedData();
  const filter = buildFilter(q);

  const page = q.page ?? 1;
  const limit = q.limit ?? 50;
  const isNear = q.lat !== undefined && q.lng !== undefined;

  const cursor = RiskZone.find(filter)
    .skip((page - 1) * limit)
    .limit(limit);
  if (!isNear) cursor.sort(q.sort || '-vulnerabilityScore'); // $nearSphere already sorts

  const [items, total] = await Promise.all([
    cursor.lean({ virtuals: true }),
    RiskZone.countDocuments(filter),
  ]);

  return { items, meta: { total, page, limit, pages: Math.ceil(total / limit) || 1 } };
};

export const queryRiskZonesAsGeoJSON = async (q) => {
  await ensureSeedData();
  const docs = await RiskZone.find(buildFilter(q)).limit(q.limit ?? 500);
  return {
    type: 'FeatureCollection',
    features: docs.map((d) => d.toFeature()),
  };
};

export const getRiskZoneByIdentifier = async (identifier) => {
  await ensureSeedData();
  const query = mongoose.isValidObjectId(identifier)
    ? { _id: identifier }
    : { zoneId: identifier.toUpperCase() };

  const zone = await RiskZone.findOne(query);
  if (!zone) throw ApiError.notFound(`Risk zone "${identifier}" not found`);
  return zone;
};

export const getSummary = async () => {
  await ensureSeedData();
  const [byLevel, byHazard, totals] = await Promise.all([

    RiskZone.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$riskLevel', count: { $sum: 1 }, population: { $sum: '$population' } } },
    ]),
    RiskZone.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$hazardType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    RiskZone.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          zones: { $sum: 1 },
          populationAtRisk: { $sum: '$population' },
          avgVulnerability: { $avg: '$vulnerabilityScore' },
          maxVulnerability: { $max: '$vulnerabilityScore' },
        },
      },
    ]),
  ]);

  return {
    totals: totals[0]
      ? { ...totals[0], _id: undefined, avgVulnerability: Number(totals[0].avgVulnerability.toFixed(1)) }
      : { zones: 0, populationAtRisk: 0, avgVulnerability: 0, maxVulnerability: 0 },
    byRiskLevel: Object.fromEntries(byLevel.map((r) => [r._id, { count: r.count, population: r.population }])),
    byHazardType: Object.fromEntries(byHazard.map((r) => [r._id, r.count])),
    generatedAt: new Date().toISOString(),
  };
};

export const createRiskZone = (payload, userId) =>
  RiskZone.create({ ...payload, createdBy: userId });

export const updateRiskZone = async (identifier, payload) => {
  const zone = await getRiskZoneByIdentifier(identifier);
  Object.assign(zone, payload, { lastTelemetryAt: new Date() });
  return zone.save();
};

export const deleteRiskZone = async (identifier) => {
  const zone = await getRiskZoneByIdentifier(identifier);
  zone.isActive = false;      // soft delete keeps telemetry history intact
  await zone.save();
  return zone;
};
