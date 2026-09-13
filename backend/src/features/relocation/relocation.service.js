import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RelocationLocation, RelocationRequest, RelocationPriority, seedLocations, seedRiskZones } from './relocation.model.js';
import { RiskZone } from '../riskZones/riskZone.model.js';
import { ApiError } from '../../common/utils/ApiError.js';
import { httpStatusCodes } from '../../common/constants/httpStatusCodes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ML_DATA_PATH = path.resolve(__dirname, '../../../../ml-proxy/outputs/data/relocationPriorities.json');

const toRadians = (value) => (value * Math.PI) / 180;

const haversineKm = (a, b) => {
  const earthRadiusKm = 6371;
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const inner =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(inner), Math.sqrt(1 - inner));
  return earthRadiusKm * c;
};

const pointToSegmentDistanceKm = (p, a, b) => {
  const x = p.longitude;
  const y = p.latitude;
  const x1 = a.longitude;
  const y1 = a.latitude;
  const x2 = b.longitude;
  const y2 = b.latitude;

  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0 && dy === 0) {
    return haversineKm(p, a);
  }

  const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
  const projection = {
    longitude: x1 + t * dx,
    latitude: y1 + t * dy,
  };

  return haversineKm(p, projection);
};

const intersectsRiskZone = (routePath, zone) => {
  const zoneRadiusKm = zone.radiusKm || (zone.radiusMeters ? zone.radiusMeters / 1000 : 1.0);
  const zoneLat = zone.latitude ?? zone.center?.coordinates?.[1] ?? zone.lat;
  const zoneLng = zone.longitude ?? zone.center?.coordinates?.[0] ?? zone.lng;

  if (zoneLat == null || zoneLng == null) return false;

  for (let i = 0; i < routePath.length - 1; i += 1) {
    const d = pointToSegmentDistanceKm(
      { latitude: zoneLat, longitude: zoneLng },
      routePath[i],
      routePath[i + 1]
    );

    if (d <= zoneRadiusKm) {
      return true;
    }
  }

  return false;
};

const calculatePathDistance = (path) => {
  let distance = 0;
  for (let i = 0; i < path.length - 1; i += 1) {
    distance += haversineKm(path[i], path[i + 1]);
  }
  return distance;
};

const midpoint = (a, b) => ({
  latitude: (a.latitude + b.latitude) / 2,
  longitude: (a.longitude + b.longitude) / 2,
});

const round = (value) => Math.round(value * 10) / 10;

export async function ensureSeedData() {

  const [locCount, prioCount] = await Promise.all([
    RelocationLocation.countDocuments(),
    RelocationPriority.countDocuments(),
  ]);

  if (prioCount === 0) {
    try {
      if (fs.existsSync(ML_DATA_PATH)) {
        const raw = fs.readFileSync(ML_DATA_PATH, 'utf-8');
        const list = JSON.parse(raw);
        if (Array.isArray(list) && list.length > 0) {
          await RelocationPriority.insertMany(list);
          console.log(`[seed:relocation] Inserted ${list.length} ML relocation priorities`);

          // Also populate RelocationLocation start and safe points from ML data
          if (locCount === 0) {
            const locs = [];
            const seen = new Set();
            for (const item of list) {
              if (item.habitationName && item.originLatLng?.length === 2 && !seen.has(item.habitationName)) {
                seen.add(item.habitationName);
                locs.push({
                  name: item.habitationName,
                  category: 'start',
                  latitude: item.originLatLng[0],
                  longitude: item.originLatLng[1],
                  capacity: null,
                  currentOccupancy: item.vulnerablePopulation,
                });
              }
              if (item.destinationRefugeSector && item.destinationLatLng?.length === 2 && !seen.has(item.destinationRefugeSector)) {
                seen.add(item.destinationRefugeSector);
                locs.push({
                  name: item.destinationRefugeSector,
                  category: 'safe',
                  latitude: item.destinationLatLng[0],
                  longitude: item.destinationLatLng[1],
                  capacity: item.availableShelterCapacity || 25000,
                  currentOccupancy: item.allocatedShelterBeds || 5000,
                });
              }
            }
            if (locs.length > 0) {
              await RelocationLocation.insertMany(locs);
              console.log(`[seed:relocation] Inserted ${locs.length} ML relocation locations`);
            }
          }
        }
      }
    } catch (err) {
      console.warn('[seed:relocation] Could not seed from ML data:', err.message);
    }
  }

  if ((await RelocationLocation.countDocuments()) === 0) {
    await RelocationLocation.insertMany(seedLocations);
  }
}

export async function getRelocationPriorities(query = {}) {
  await ensureSeedData();

  const filter = {};
  if (query.tier) {
    filter.priorityTier = query.tier;
  }
  if (query.status) {
    filter.status = query.status;
  }
  if (query.search) {
    filter.$or = [
      { habitationName: new RegExp(query.search, 'i') },
      { region: new RegExp(query.search, 'i') },
      { destinationRefugeSector: new RegExp(query.search, 'i') },
      { zoneId: new RegExp(query.search, 'i') },
    ];
  }

  return RelocationPriority.find(filter).sort({ priorityRank: 1 }).lean();
}


export async function getRelocationOptions() {
  await ensureSeedData();

  const [locations, dbHazards] = await Promise.all([
    RelocationLocation.find({ isActive: true }).lean(),
    RiskZone.find({ isActive: true }).lean(),
  ]);

  // Combine DB risk zones with seed risk zones for comprehensive spatial hazard mapping
  const hazards = [
    ...dbHazards.map((z) => ({
      name: z.name,
      latitude: z.center?.coordinates?.[1] ?? z.lat,
      longitude: z.center?.coordinates?.[0] ?? z.lng,
      radiusKm: (z.radiusMeters || 800) / 1000,
      severity: z.riskLevel === 'critical' ? 'high' : z.riskLevel === 'warning' ? 'medium' : 'low',
      riskLevel: z.riskLevel,
      zoneId: z.zoneId,
    })),
    ...seedRiskZones,
  ];

  return {
    starts: locations.filter((loc) => loc.category === 'start'),
    safeZones: locations.filter((loc) => loc.category === 'safe'),
    riskZones: hazards,
  };
}

function buildCandidateRoutes(start, destination) {
  const s = { latitude: start.latitude, longitude: start.longitude };
  const d = { latitude: destination.latitude, longitude: destination.longitude };
  const mid = midpoint(s, d);

  const northernDeviation = {
    latitude: mid.latitude + 0.025,
    longitude: mid.longitude - 0.015,
  };

  const southernDeviation = {
    latitude: mid.latitude - 0.02,
    longitude: mid.longitude + 0.025,
  };

  return [
    {
      id: 'route-a',
      label: 'Route A',
      distanceKm: 0,
      etaMinutes: 0,
      riskLevel: 'Low',
      status: 'ALTERNATE',
      condition: 'Primary Northern Contour',
      path: [s, northernDeviation, d],
    },
    {
      id: 'route-b',
      label: 'Route B',
      distanceKm: 0,
      etaMinutes: 0,
      riskLevel: 'Low',
      status: 'ALTERNATE',
      condition: 'Southern Valley Bypass',
      path: [s, southernDeviation, d],
    },
    {
      id: 'route-c',
      label: 'Route C',
      distanceKm: 0,
      etaMinutes: 0,
      riskLevel: 'Low',
      status: 'ALTERNATE',
      condition: 'Direct Emergency Transit',
      path: [s, d],
    },
  ];
}

function scoreRoute(route, hazards) {
  const intersecting = hazards.filter((zone) => intersectsRiskZone(route.path, zone));
  const distanceKm = calculatePathDistance(route.path);
  const etaMinutes = Math.max(6, Math.round((distanceKm / 28) * 60));

  if (intersecting.length === 0) {
    return {
      ...route,
      distanceKm: round(distanceKm),
      etaMinutes,
      riskLevel: 'Low',
      status: 'ALTERNATE',
      condition: 'Clear safe contour',
    };
  }

  const hasHigh = intersecting.some((zone) => zone.severity === 'high' || zone.riskLevel === 'critical');
  const hasMedium = intersecting.some((zone) => zone.severity === 'medium' || zone.riskLevel === 'warning');

  if (hasHigh) {
    return {
      ...route,
      distanceKm: round(distanceKm),
      etaMinutes,
      riskLevel: 'High',
      status: 'BLOCKED',
      condition: 'Compromised by critical hazard perimeter',
    };
  }

  if (hasMedium) {
    return {
      ...route,
      distanceKm: round(distanceKm),
      etaMinutes,
      riskLevel: 'Medium',
      status: 'ALTERNATE',
      condition: 'Elevated terrain caution required',
    };
  }

  return {
    ...route,
    distanceKm: round(distanceKm),
    etaMinutes,
    riskLevel: 'Low',
    status: 'ALTERNATE',
    condition: 'Minor terrain deviation',
  };
}

function pickRecommendedRoute(routes) {
  const priority = { RECOMMENDED: 0, ALTERNATE: 1, BLOCKED: 2 };
  const riskScore = { Low: 0, Medium: 1, High: 2 };

  const sorted = [...routes].sort((a, b) => {
    if (a.riskLevel !== b.riskLevel) {
      return riskScore[a.riskLevel] - riskScore[b.riskLevel];
    }
    if (a.status !== b.status) {
      return priority[a.status] - priority[b.status];
    }
    return a.distanceKm - b.distanceKm;
  });

  return sorted[0];
}

export async function calculateRelocation(startId, destinationId) {
  await ensureSeedData();

  // Helper to query location by ObjectId, string id, or name
  const findLocation = async (idOrName, category) => {
    const query = { category, isActive: true };
    if (mongoose.isValidObjectId(idOrName)) {
      query._id = idOrName;
    } else {
      query.$or = [{ name: new RegExp(String(idOrName), 'i') }, { _id: idOrName }];
    }
    return RelocationLocation.findOne(query);
  };

  const [start, destination] = await Promise.all([
    findLocation(startId, 'start'),
    findLocation(destinationId, 'safe'),
  ]);

  if (!start) {
    throw new ApiError(httpStatusCodes.NOT_FOUND, `Start location "${startId}" not found or invalid category.`);
  }

  if (!destination) {
    throw new ApiError(httpStatusCodes.NOT_FOUND, `Destination safe zone "${destinationId}" not found or invalid category.`);
  }

  const { riskZones: hazards } = await getRelocationOptions();

  const scoredRoutes = buildCandidateRoutes(start, destination).map((route) => scoreRoute(route, hazards));
  const recommended = pickRecommendedRoute(scoredRoutes);

  const finalized = scoredRoutes.map((route) => {
    if (route.id !== recommended.id) {
      return route;
    }
    return {
      ...route,
      status: route.status === 'BLOCKED' ? 'BLOCKED' : 'RECOMMENDED',
    };
  });

  const run = await RelocationRequest.create({
    startLocationId: start._id,
    startLocation: start.toObject ? start.toObject() : start,
    destinationLocationId: destination._id,
    destinationLocation: destination.toObject ? destination.toObject() : destination,
    selectedRouteId: recommended.id,
    recommendedRouteId: recommended.id,
    routes: finalized,
  });

  return {
    id: run._id,
    start,
    destination,
    routes: finalized,
    recommendedRouteId: recommended.id,
    createdAt: run.createdAt,
  };
}

export async function getRecentRelocations(limit = 10) {
  return RelocationRequest.find().sort({ createdAt: -1 }).limit(limit).lean();
}

export async function getRelocationById(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(httpStatusCodes.BAD_REQUEST, 'Invalid relocation calculation ID.');
  }
  const item = await RelocationRequest.findById(id).lean();
  if (!item) {
    throw new ApiError(httpStatusCodes.NOT_FOUND, `Relocation run "${id}" not found.`);
  }
  return item;
}

export default {
  ensureSeedData,
  getRelocationOptions,
  getRelocationPriorities,
  calculateRelocation,
  getRecentRelocations,
  getRelocationById,
};

