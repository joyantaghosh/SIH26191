import mongoose from 'mongoose';

const { Schema } = mongoose;

export const seedEvacLocations = [
  {
    name: 'Sector 4 Habitation',
    category: 'origin',
    coordinates: [106.78, -6.22],
    elevationMeters: 45,
    population: 1450,
  },
  {
    name: 'Sector 7 Industrial',
    category: 'origin',
    coordinates: [106.82, -6.18],
    elevationMeters: 38,
    population: 920,
  },
  {
    name: 'Residential Block A',
    category: 'origin',
    coordinates: [106.76, -6.25],
    elevationMeters: 52,
    population: 2100,
  },
  {
    name: 'Alpha Command Bunker',
    category: 'shelter',
    coordinates: [106.88, -6.15],
    capacity: 3500,
    currentOccupancy: 820,
    elevationMeters: 110,
  },
  {
    name: 'Highland Relief Center',
    category: 'shelter',
    coordinates: [106.85, -6.12],
    capacity: 2200,
    currentOccupancy: 450,
    elevationMeters: 145,
  },
  {
    name: 'Coastal Evac Point',
    category: 'shelter',
    coordinates: [106.92, -6.28],
    capacity: 1800,
    currentOccupancy: 310,
    elevationMeters: 60,
  },
];

const evacLocationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    category: { type: String, enum: ['origin', 'shelter'], required: true, index: true },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 2,
        message: 'coordinates must be [longitude, latitude]',
      },
    },
    elevationMeters: { type: Number, default: 50 },
    population: { type: Number, default: 0 },
    capacity: { type: Number, default: null },
    currentOccupancy: { type: Number, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

evacLocationSchema.index({ coordinates: '2dsphere' });

const evacWaypointSchema = new Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { _id: false }
);

const evacRouteOptionSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    distanceKm: { type: Number, required: true },
    etaMinutes: { type: Number, required: true },
    status: { type: String, enum: ['RECOMMENDED', 'ALTERNATE', 'BLOCKED'], default: 'ALTERNATE' },
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    condition: { type: String, default: '' },
    bottleneckRisk: { type: String, default: 'Nominal' },
    clearanceIndex: { type: Number, default: 90 },
    waypoints: [evacWaypointSchema],
  },
  { _id: false }
);

const evacuationPlanSchema = new Schema(
  {
    planId: { type: String, required: true, unique: true, index: true },
    originName: { type: String, required: true },
    originCoordinates: { type: [Number], required: true },
    destinationName: { type: String, required: true },
    destinationCoordinates: { type: [Number], required: true },
    recommendedRouteId: { type: String, required: true },
    routes: [evacRouteOptionSchema],
    hazardPerimeter: {
      coordinates: [Number],
      radiusMeters: Number,
      hazardType: String,
    },
    trafficDensity: { type: String, default: 'Moderate' },
  },
  { timestamps: true }
);

export const EvacuationLocation = mongoose.model('EvacuationLocation', evacLocationSchema);
export const EvacuationPlan = mongoose.model('EvacuationPlan', evacuationPlanSchema);

export default {
  EvacuationLocation,
  EvacuationPlan,
  seedEvacLocations,
};
