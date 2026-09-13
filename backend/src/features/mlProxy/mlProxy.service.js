import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { RiskZone } from '../riskZones/riskZone.model.js';
import { CapacitySector, CapacityAssessment } from '../carryingCapacity/capacity.model.js';
import { RelocationLocation, RelocationPriority } from '../relocation/relocation.model.js';
import { EvacuationLocation } from '../evacuation/evacuation.model.js';
import { Settlement } from '../settlements/settlement.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ML_PROXY_URL = process.env.ML_PROXY_URL || 'http://localhost:8000';
const LOCAL_DATA_DIR = path.resolve(__dirname, '../../../../ml-proxy/outputs/data');

/**
 * Loads a dataset either from the live ML-Proxy HTTP microservice or from local file exports.
 */
export async function loadMLDataset(filename, apiPath) {
  // 1. Attempt fetching from running microservice
  try {
    const res = await axios.get(`${ML_PROXY_URL}${apiPath}`, { timeout: 2000 });
    if (Array.isArray(res.data) && res.data.length > 0) {
      return { source: 'live-microservice', data: res.data };
    }
  } catch (_) {
    // Microservice not running or unreachable — proceed to local file fallback
  }

  // 2. Read from local exported JSON file
  const filePath = path.join(LOCAL_DATA_DIR, filename);
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return { source: 'local-file-export', data: JSON.parse(raw) };
  }

  return { source: 'none', data: [] };
}

/**
 * Synchronizes all ML proxy datasets directly into MongoDB.
 */
export async function syncAllMLData() {
  const results = {
    riskZones: 0,
    carryingCapacity: 0,
    relocationPriorities: 0,
    evacuationLocations: 0,
    settlements: 0,
    sources: {},
  };

  // 1. Sync Risk Zones
  const { source: rSource, data: riskZones } = await loadMLDataset('riskZones.json', '/api/ml/risk-zones');
  results.sources.riskZones = rSource;
  if (riskZones.length > 0) {
    await RiskZone.deleteMany({});
    const zones = riskZones.map((item) => {
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
        center: { type: 'Point', coordinates: [coords[0], coords[1]] },
        radiusMeters: item.radiusMeters || 5000,
        isActive: true,
      };
    });
    const createdZones = await RiskZone.insertMany(zones);
    results.riskZones = createdZones.length;

    // Also sync matching Settlements
    await Settlement.deleteMany({});
    const settlements = zones.map((z, idx) => ({
      settlementId: `SETTL-${idx + 1001}`,
      name: z.name.replace(/Multi-Hazard Active Disaster Zone/i, 'Sector').trim(),
      district: z.region ? z.region.split(',')[0].trim() : 'District Zone',
      riskLevel: z.riskLevel === 'critical' ? 'Critical' : z.riskLevel === 'safe' ? 'Safe' : 'Warning',
      population: z.population,
      vulnerabilityScore: z.vulnerabilityScore,
      hazardType: z.hazardType.charAt(0).toUpperCase() + z.hazardType.slice(1),
      distanceToHazardKm: z.distanceToHazardKm,
      routeStatus: z.riskLevel === 'critical' ? 'Compromised' : 'Clear',
      progress: Math.max(15, 100 - z.vulnerabilityScore),
      location: z.center,
      mapPlacement: {
        top: `${Math.round(20 + (idx % 8) * 8)}%`,
        left: `${Math.round(15 + (idx % 7) * 11)}%`,
      },
      isActive: true,
    }));
    const createdSettlements = await Settlement.insertMany(settlements);
    results.settlements = createdSettlements.length;
  }

  // 2. Sync Carrying Capacity
  const { source: cSource, data: capacities } = await loadMLDataset('carryingCapacity.json', '/api/ml/capacity');
  results.sources.carryingCapacity = cSource;
  if (capacities.length > 0) {
    await CapacitySector.deleteMany({});
    await CapacityAssessment.deleteMany({});

    const sectors = capacities.map((item) => {
      const pop = item.population || 50000;
      const maxCap = item.maxSafeCapacity || Math.round(pop * 1.2);
      const region = item.sectorName ? item.sectorName.replace(/Carrying Capacity Sector/i, '').trim() : 'Disaster Zone';
      return {
        sectorId: item.assessmentId,
        name: item.sectorName,
        region,
        currentPopulation: pop,
        landHectares: Math.max(100, Math.round(pop / 15)),
        waterSupplyLitersDay: pop * 28,
        electricitySupplyMw: Math.max(15, Math.round(pop / 5000)),
        housingUnits: Math.max(100, Math.round(pop / 3.5)),
        medicalBeds: Math.max(50, Math.round(maxCap / 18.5)),
        slopeStabilityRating: item.stressLevel === 'CRITICAL' ? 62 : item.stressLevel === 'HIGH' ? 74 : 88,
        status: item.stressLevel === 'CRITICAL' ? 'Critical Stress' : item.stressLevel === 'HIGH' ? 'High Load Sector' : 'Sector Nominal',
        isActive: true,
      };
    });
    const createdSectors = await CapacitySector.insertMany(sectors);
    results.carryingCapacity = createdSectors.length;

    const assessments = capacities.map((item) => ({
      assessmentId: item.assessmentId,
      sectorName: item.sectorName,
      inputParameters: {
        population: item.population,
        landHectares: Math.max(100, Math.round(item.population / 15)),
        waterSupplyLitersDay: item.population * 28,
        housingUnits: Math.max(100, Math.round(item.population / 3.5)),
        medicalBeds: Math.max(50, Math.round(item.maxSafeCapacity / 18.5)),
      },
      calculatedMetrics: {
        maxSafeCapacity: item.maxSafeCapacity,
        availableCapacity: item.availableCapacity,
        populationSaturationPercent: Number(((item.population / item.maxSafeCapacity) * 100).toFixed(1)),
        waterUtilizationPercent: 78,
        housingUtilizationPercent: 82,
        healthUtilizationPercent: 75,
        stressLevel: item.stressLevel === 'HIGH' ? 'ELEVATED' : item.stressLevel,
      },
      recommendations: [
        'Maintain active groundwater and relief supply monitoring.',
        'Prepare auxiliary high-ground shelter overflow reserves.',
      ],
    }));
    await CapacityAssessment.insertMany(assessments);
  }

  // 3. Sync Relocation Priorities & Locations
  const { source: relSource, data: relocations } = await loadMLDataset('relocationPriorities.json', '/api/ml/relocation');
  results.sources.relocationPriorities = relSource;
  if (relocations.length > 0) {
    await RelocationPriority.deleteMany({});
    const createdPriorities = await RelocationPriority.insertMany(relocations);
    results.relocationPriorities = createdPriorities.length;

    // Sync Relocation Locations
    await RelocationLocation.deleteMany({});
    const locs = [];
    const seen = new Set();
    for (const item of relocations) {
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
    }
  }

  // 4. Sync Evacuation Locations from Routes
  const { source: rtSource, data: routes } = await loadMLDataset('evacuationRoutes.json', '/api/ml/routes');
  results.sources.evacuationRoutes = rtSource;
  if (routes.length > 0) {
    await EvacuationLocation.deleteMany({});
    const evacLocs = [];
    const evacSeen = new Set();
    for (const r of routes) {
      if (r.originName && r.originCoordinates?.length === 2 && !evacSeen.has(r.originName)) {
        evacSeen.add(r.originName);
        evacLocs.push({
          name: r.originName,
          category: 'origin',
          coordinates: r.originCoordinates,
          population: 2500,
          elevationMeters: 450,
        });
      }
      if (r.destinationName && r.destinationCoordinates?.length === 2 && !evacSeen.has(r.destinationName)) {
        evacSeen.add(r.destinationName);
        evacLocs.push({
          name: r.destinationName,
          category: 'shelter',
          coordinates: r.destinationCoordinates,
          capacity: r.destinationMaxCapacity || 50000,
          currentOccupancy: (r.destinationMaxCapacity || 50000) - (r.destinationAvailableCapacity || 20000),
          elevationMeters: 850,
        });
      }
    }
    if (evacLocs.length > 0) {
      const createdEvac = await EvacuationLocation.insertMany(evacLocs);
      results.evacuationLocations = createdEvac.length;
    }
  }

  return results;
}

/**
 * Returns database record counts and connection status.
 */
export async function getMLStatus() {
  const [riskZones, sectors, assessments, priorities, relocLocations, evacLocations, settlements] =
    await Promise.all([
      RiskZone.countDocuments(),
      CapacitySector.countDocuments(),
      CapacityAssessment.countDocuments(),
      RelocationPriority.countDocuments(),
      RelocationLocation.countDocuments(),
      EvacuationLocation.countDocuments(),
      Settlement.countDocuments(),
    ]);

  return {
    status: 'online',
    microserviceUrl: ML_PROXY_URL,
    localDataDir: LOCAL_DATA_DIR,
    databaseCounts: {
      riskZones,
      capacitySectors: sectors,
      capacityAssessments: assessments,
      relocationPriorities: priorities,
      relocationLocations: relocLocations,
      evacuationLocations: evacLocations,
      settlements,
    },
  };
}

export default {
  loadMLDataset,
  syncAllMLData,
  getMLStatus,
};
