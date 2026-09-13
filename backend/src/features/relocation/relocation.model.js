import mongoose from 'mongoose';

const { Schema } = mongoose;

export const seedLocations = [
  {
    name: "Sector 4 Habitation",
    category: "start",
    latitude: -6.1372,
    longitude: 106.865,
    capacity: null,
    currentOccupancy: null,
  },
  {
    name: "West Perimeter Camp",
    category: "start",
    latitude: -6.242,
    longitude: 106.811,
    capacity: null,
    currentOccupancy: null,
  },
  {
    name: "Oakhaven Valley Sector",
    category: "start",
    latitude: -6.2,
    longitude: 106.8,
    capacity: null,
    currentOccupancy: null,
  },
  {
    name: "Alpha Command Bunker",
    category: "safe",
    latitude: -6.229,
    longitude: 106.802,
    capacity: 1200,
    currentOccupancy: 640,
  },
  {
    name: "North Transit Shelter",
    category: "safe",
    latitude: -6.118,
    longitude: 106.83,
    capacity: 900,
    currentOccupancy: 520,
  },
  {
    name: "Riverbend Refuge East",
    category: "safe",
    latitude: -6.23,
    longitude: 106.9,
    capacity: 2500,
    currentOccupancy: 1100,
  },
];

export const seedRiskZones = [
  {
    name: "Gondangdia Sinkhole Cluster",
    latitude: -6.193,
    longitude: 106.833,
    radiusKm: 2.9,
    severity: "high",
  },
  {
    name: "Canal Overflow Belt",
    latitude: -6.146,
    longitude: 106.856,
    radiusKm: 1.6,
    severity: "medium",
  },
  {
    name: "Oakhaven Mudslide Vector",
    latitude: -6.2,
    longitude: 106.8,
    radiusKm: 1.8,
    severity: "high",
  },
];

const relocationLocationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ['start', 'safe'], required: true, index: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    capacity: { type: Number, default: null },
    currentOccupancy: { type: Number, default: null },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

const pointCoordinateSchema = new Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { _id: false }
);

const routeSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    distanceKm: { type: Number, required: true },
    etaMinutes: { type: Number, required: true },
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    status: { type: String, enum: ['RECOMMENDED', 'ALTERNATE', 'BLOCKED'], default: 'ALTERNATE' },
    condition: { type: String, default: '' },
    path: [pointCoordinateSchema],
  },
  { _id: false }
);

const relocationRequestSchema = new Schema(
  {
    startLocationId: { type: Schema.Types.ObjectId, ref: 'RelocationLocation' },
    startLocation: { type: Object },
    destinationLocationId: { type: Schema.Types.ObjectId, ref: 'RelocationLocation' },
    destinationLocation: { type: Object },
    selectedRouteId: { type: String, required: true },
    recommendedRouteId: { type: String, required: true },
    routes: [routeSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

export const RelocationLocation = mongoose.model('RelocationLocation', relocationLocationSchema);
export const RelocationRequest = mongoose.model('RelocationRequest', relocationRequestSchema);

const relocationPrioritySchema = new Schema(
  {
    relocationId: { type: String, required: true, unique: true, index: true },
    zoneId: { type: String, required: true, index: true },
    region: { type: String, required: true },
    habitationName: { type: String, required: true },
    vulnerablePopulation: { type: Number, default: 0 },
    priorityRank: { type: Number, default: 1, index: true },
    priorityTier: {
      type: String,
      enum: ['CRITICAL_URGENT', 'HIGH_PRIORITY', 'MEDIUM_PRIORITY', 'MONITORING'],
      default: 'MEDIUM_PRIORITY',
      index: true,
    },
    priorityScore: { type: Number, default: 50.0, index: true },
    mobilityConstrainedCount: { type: Number, default: 0 },
    destinationRefugeSector: { type: String, required: true },
    destinationRiskScore: { type: String, default: 'LOW RISK (1.8 / 10)' },
    allocatedShelterBeds: { type: Number, default: 0 },
    availableShelterCapacity: { type: Number, default: 0 },
    status: { type: String, default: 'PENDING_EVACUATION' },
    originLatLng: { type: [Number], default: [] },
    destinationLatLng: { type: [Number], default: [] },
    curvedPath: { type: [[Number]], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

export const RelocationPriority = mongoose.model('RelocationPriority', relocationPrioritySchema);

export default {
  RelocationLocation,
  RelocationRequest,
  RelocationPriority,
  seedLocations,
  seedRiskZones,
};

