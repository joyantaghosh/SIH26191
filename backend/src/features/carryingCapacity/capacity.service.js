import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CapacitySector, CapacityAssessment, seedCapacitySectors } from './capacity.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ML_CAPACITY_PATH = path.resolve(__dirname, '../../../../ml-proxy/outputs/data/carryingCapacity.json');

export async function ensureSeedData() {
  const count = await CapacitySector.countDocuments();
  if (count === 0) {
    let seeded = false;
    if (fs.existsSync(ML_CAPACITY_PATH)) {
      try {
        const raw = fs.readFileSync(ML_CAPACITY_PATH, 'utf-8');
        const list = JSON.parse(raw);
        if (Array.isArray(list) && list.length > 0) {
          const sectors = list.map((item) => {
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

          await CapacitySector.insertMany(sectors);
          console.log(`[seed:capacity] Inserted ${sectors.length} ML capacity sectors`);
          seeded = true;

          // Also insert initial assessments
          const assessments = list.map((item) => ({
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
      } catch (err) {
        console.warn('[seed:capacity] Could not seed from ML data:', err.message);
      }
    }
    if (!seeded) {
      await CapacitySector.insertMany(seedCapacitySectors);
    }
  }
}


export async function getCapacitySectors() {
  await ensureSeedData();
  return CapacitySector.find({ isActive: true }).lean();
}

/**
 * Multi-resource carrying capacity calculation algorithm
 */
export async function calculateCarryingCapacity(params = {}) {
  const {
    sectorName = 'Terrain Analysis Sector',
    population = 4800,
    landHectares = 1250,
    waterSupplyLitersDay = 150000,
    housingUnits = 2100,
    medicalBeds = 350,
  } = params;

  const pop = Number(population) || 4800;
  const land = Number(landHectares) || 1250;
  const water = Number(waterSupplyLitersDay) || 150000;
  const housing = Number(housingUnits) || 2100;
  const beds = Number(medicalBeds) || 350;

  // Maximum sustainable population limits per resource category
  const maxCapByBeds = Math.floor(beds * 18.5); // ~18.5 citizens supported per emergency bed
  const maxCapByWater = Math.floor(water / 25); // 25 Liters/person/day emergency baseline
  const maxCapByHousing = Math.floor(housing * 3.5); // 3.5 density per shelter unit
  const maxCapByLand = Math.floor(land * 8); // 8 persons per hectare safe slope density

  const maxSafeCapacity = Math.min(maxCapByBeds, maxCapByWater, maxCapByHousing, maxCapByLand);
  const availableCapacity = Math.max(0, maxSafeCapacity - pop);

  // Utilization percentages (capped at 100% for display meter)
  const populationSaturationPercent = Number(((pop / maxSafeCapacity) * 100).toFixed(1));
  const waterUtilizationPercent = Math.min(100, Math.round((pop * 25) / (water / 10)));
  const housingUtilizationPercent = Math.min(100, Math.round((pop / (housing * 3.5)) * 100));
  const healthUtilizationPercent = Math.min(100, Math.round((pop / maxCapByBeds) * 100));

  // Determine stress level
  let stressLevel = 'NORMAL';
  if (populationSaturationPercent >= 90 || waterUtilizationPercent >= 90 || healthUtilizationPercent >= 90) {
    stressLevel = 'CRITICAL';
  } else if (populationSaturationPercent >= 75 || waterUtilizationPercent >= 75 || healthUtilizationPercent >= 75) {
    stressLevel = 'ELEVATED';
  }

  // Recommendations
  const recommendations = [];
  if (waterUtilizationPercent > 80) {
    recommendations.push('Deploy mobile water purification units and auxiliary bowsers to avoid catchment strain.');
  }
  if (healthUtilizationPercent > 85) {
    recommendations.push('Emergency triage beds near threshold. Activate secondary medical relief field camp.');
  }
  if (housingUtilizationPercent > 85) {
    recommendations.push('Housing density elevated. Prepare overflow tentage in lower-grade slope zones.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Sector operating in optimal reserve equilibrium. Ready to accept secondary evacuees.');
  }

  const assessmentId = `CAP-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

  const savedAssessment = await CapacityAssessment.create({
    assessmentId,
    sectorName,
    inputParameters: {
      population: pop,
      landHectares: land,
      waterSupplyLitersDay: water,
      housingUnits: housing,
      medicalBeds: beds,
    },
    calculatedMetrics: {
      maxSafeCapacity,
      availableCapacity,
      populationSaturationPercent,
      waterUtilizationPercent,
      housingUtilizationPercent,
      healthUtilizationPercent,
      stressLevel,
    },
    recommendations,
  });

  return savedAssessment;
}

export async function getAssessmentHistory(limit = 10) {
  return CapacityAssessment.find().sort({ createdAt: -1 }).limit(limit).lean();
}

export default {
  ensureSeedData,
  getCapacitySectors,
  calculateCarryingCapacity,
  getAssessmentHistory,
};
