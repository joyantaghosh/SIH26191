import mongoose from 'mongoose';

const { Schema } = mongoose;

export const seedSettlements = [
  {
    settlementId: 'S-9921',
    name: 'Oakhaven Terrain Sector',
    district: 'Northern Sector',
    riskLevel: 'Critical',
    population: 1452,
    vulnerabilityScore: 94,
    hazardType: 'Terrain Mudslide',
    distanceToHazardKm: 0.4,
    routeStatus: 'Compromised',
    progress: 35,
    location: { type: 'Point', coordinates: [106.8, -6.2] },
    mapPlacement: { top: '35%', left: '45%' },
  },
  {
    settlementId: 'S-8810',
    name: 'Pine Ridge Habitation',
    district: 'Eastern Valley',
    riskLevel: 'Warning',
    population: 850,
    vulnerabilityScore: 68,
    hazardType: 'Flash Flood',
    distanceToHazardKm: 1.2,
    routeStatus: 'Clear',
    progress: 60,
    location: { type: 'Point', coordinates: [106.85, -6.18] },
    mapPlacement: { top: '60%', left: '65%' },
  },
  {
    settlementId: 'S-4402',
    name: 'Riverbend Shelter Area',
    district: 'Coastal Delta',
    riskLevel: 'Safe',
    population: 3200,
    vulnerabilityScore: 15,
    hazardType: 'Low Risk Contour',
    distanceToHazardKm: 4.8,
    routeStatus: 'Optimal',
    progress: 90,
    location: { type: 'Point', coordinates: [106.75, -6.28] },
    mapPlacement: { top: '40%', left: '25%' },
  },
  {
    settlementId: 'S-3105',
    name: 'Highland Ridge West',
    district: 'Northern Sector',
    riskLevel: 'Critical',
    population: 980,
    vulnerabilityScore: 88,
    hazardType: 'Slope Landslide',
    distanceToHazardKm: 0.7,
    routeStatus: 'Blocked',
    progress: 20,
    location: { type: 'Point', coordinates: [106.88, -6.12] },
    mapPlacement: { top: '25%', left: '70%' },
  },
];

const settlementSchema = new Schema(
  {
    settlementId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true, index: true },
    riskLevel: {
      type: String,
      enum: ['Critical', 'Warning', 'Safe'],
      required: true,
      index: true,
    },
    population: { type: Number, required: true },
    vulnerabilityScore: { type: Number, min: 0, max: 100, required: true },
    hazardType: { type: String, default: 'Landslide' },
    distanceToHazardKm: { type: Number, default: 1.0 },
    routeStatus: { type: String, default: 'Clear' },
    progress: { type: Number, min: 0, max: 100, default: 50 },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    mapPlacement: {
      top: { type: String, default: '50%' },
      left: { type: String, default: '50%' },
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

settlementSchema.index({ location: '2dsphere' });

export const Settlement = mongoose.model('Settlement', settlementSchema);
export default Settlement;
