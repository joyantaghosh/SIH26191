import mongoose from 'mongoose';

const { Schema } = mongoose;

export const seedCapacitySectors = [
  {
    sectorId: 'CAP-01',
    name: 'Alpha Safe Haven Sector',
    region: 'Jakarta Selatan',
    currentPopulation: 4800,
    landHectares: 1250,
    waterSupplyLitersDay: 150000,
    electricitySupplyMw: 45,
    housingUnits: 2100,
    medicalBeds: 350,
    slopeStabilityRating: 92,
    status: 'Sector Nominal',
  },
  {
    sectorId: 'CAP-02',
    name: 'Riverbend High Refuge Center',
    region: 'Jakarta Timur',
    currentPopulation: 2900,
    landHectares: 850,
    waterSupplyLitersDay: 110000,
    electricitySupplyMw: 32,
    housingUnits: 1400,
    medicalBeds: 210,
    slopeStabilityRating: 88,
    status: 'Sector Nominal',
  },
  {
    sectorId: 'CAP-03',
    name: 'Highland Crest Command Haven',
    region: 'Jakarta Barat',
    currentPopulation: 6200,
    landHectares: 1600,
    waterSupplyLitersDay: 190000,
    electricitySupplyMw: 58,
    housingUnits: 2700,
    medicalBeds: 420,
    slopeStabilityRating: 95,
    status: 'Optimal Reserve',
  },
];

const capacitySectorSchema = new Schema(
  {
    sectorId: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true, trim: true },
    region: { type: String, default: 'Jakarta Region' },
    currentPopulation: { type: Number, required: true },
    landHectares: { type: Number, required: true },
    waterSupplyLitersDay: { type: Number, required: true },
    electricitySupplyMw: { type: Number, default: 40 },
    housingUnits: { type: Number, required: true },
    medicalBeds: { type: Number, required: true },
    slopeStabilityRating: { type: Number, default: 90 },
    status: { type: String, default: 'Sector Nominal' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const capacityAssessmentSchema = new Schema(
  {
    assessmentId: { type: String, required: true, unique: true, index: true },
    sectorName: { type: String, default: 'Custom Terrain Matrix' },
    inputParameters: {
      population: Number,
      landHectares: Number,
      waterSupplyLitersDay: Number,
      housingUnits: Number,
      medicalBeds: Number,
    },
    calculatedMetrics: {
      maxSafeCapacity: Number,
      availableCapacity: Number,
      populationSaturationPercent: Number,
      waterUtilizationPercent: Number,
      housingUtilizationPercent: Number,
      healthUtilizationPercent: Number,
      stressLevel: { type: String, enum: ['NORMAL', 'ELEVATED', 'CRITICAL'], default: 'NORMAL' },
    },
    recommendations: [String],
  },
  { timestamps: true }
);

export const CapacitySector = mongoose.model('CapacitySector', capacitySectorSchema);
export const CapacityAssessment = mongoose.model('CapacityAssessment', capacityAssessmentSchema);

export default {
  CapacitySector,
  CapacityAssessment,
  seedCapacitySectors,
};
