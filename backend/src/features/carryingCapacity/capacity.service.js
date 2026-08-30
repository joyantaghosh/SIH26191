import { CapacitySector, CapacityAssessment, seedCapacitySectors } from './capacity.model.js';

export async function ensureSeedData() {
  const count = await CapacitySector.countDocuments();
  if (count === 0) {
    await CapacitySector.insertMany(seedCapacitySectors);
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
