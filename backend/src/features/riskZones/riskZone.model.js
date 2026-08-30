import mongoose from 'mongoose';

const { Schema } = mongoose;

export const RISK_LEVELS = ['critical', 'warning', 'safe'];
export const HAZARD_TYPES = [
  'flood', 'mudslide', 'flood_mudslide', 'landslide',
  'earthquake', 'wildfire', 'coastal_erosion', 'storm_surge',
];

const pointSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point', required: true },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: (v) =>
          Array.isArray(v) && v.length === 2 &&
          v[0] >= -180 && v[0] <= 180 && v[1] >= -90 && v[1] <= 90,
        message: 'center.coordinates must be [lng, lat] within valid ranges',
      },
    },
  },
  { _id: false }
);

const polygonSchema = new Schema(
  {
    type: { type: String, enum: ['Polygon', 'MultiPolygon'], default: 'Polygon' },
    coordinates: { type: Array, required: true },
  },
  { _id: false }
);

const riskZoneSchema = new Schema(
  {
    zoneId: {
      type: String, required: true, unique: true, trim: true, uppercase: true,
      match: [/^[A-Z0-9-]{3,20}$/, 'zoneId must be alphanumeric, e.g. OKH-01'],
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    region: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, maxlength: 1000, default: '' },

    hazardType: { type: String, enum: HAZARD_TYPES, required: true, index: true },
    riskLevel: { type: String, enum: RISK_LEVELS, required: true, index: true },

    // "COMPUTED VULNERABILITY 87/100"
    vulnerabilityScore: { type: Number, min: 0, max: 100, required: true, index: true },
    // "SEVERITY INDEX 8/10"
    severityIndex: { type: Number, min: 0, max: 10, required: true },

    metrics: {
      severity: { type: Number, min: 0, max: 100, default: 0 },
      density: { type: Number, min: 0, max: 100, default: 0 },
      soilRisk: { type: Number, min: 0, max: 100, default: 0 },
    },

    population: { type: Number, min: 0, default: 0 },
    households: { type: Number, min: 0, default: 0 },
    distanceToHazardKm: { type: Number, min: 0, default: 0 },

    center: { type: pointSchema, required: true },
    radiusMeters: { type: Number, min: 10, max: 200000, default: 800 },
    area: { type: polygonSchema, default: undefined }, // optional precise footprint

    isActive: { type: Boolean, default: true, index: true },
    lastTelemetryAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

riskZoneSchema.index({ center: '2dsphere' });
riskZoneSchema.index({ area: '2dsphere' }, { sparse: true });
riskZoneSchema.index({ name: 'text', region: 'text', zoneId: 'text' });
riskZoneSchema.index({ riskLevel: 1, vulnerabilityScore: -1 });

riskZoneSchema.virtual('lat').get(function () { return this.center?.coordinates?.[1]; });
riskZoneSchema.virtual('lng').get(function () { return this.center?.coordinates?.[0]; });

// "6°12'S 106°48'E" for the scorecard header
riskZoneSchema.virtual('coordinateLabel').get(function () {
  const [lng, lat] = this.center?.coordinates || [];
  if (lat == null || lng == null) return '';
  const dms = (val, pos, neg) => {
    const abs = Math.abs(val);
    const deg = Math.floor(abs);
    const min = Math.round((abs - deg) * 60);
    return `${deg}°${String(min).padStart(2, '0')}'${val >= 0 ? pos : neg}`;
  };
  return `${dms(lat, 'N', 'S')} ${dms(lng, 'E', 'W')}`;
});

riskZoneSchema.methods.toFeature = function () {
  const o = this.toJSON();
  return {
    type: 'Feature',
    id: o.zoneId,
    geometry: o.area ?? o.center,
    properties: {
      id: o.id,
      zoneId: o.zoneId,
      name: o.name,
      region: o.region,
      hazardType: o.hazardType,
      riskLevel: o.riskLevel,
      vulnerabilityScore: o.vulnerabilityScore,
      severityIndex: o.severityIndex,
      metrics: o.metrics,
      population: o.population,
      households: o.households,
      distanceToHazardKm: o.distanceToHazardKm,
      radiusMeters: o.radiusMeters,
      coordinateLabel: o.coordinateLabel,
      lat: o.lat,
      lng: o.lng,
      lastTelemetryAt: o.lastTelemetryAt,
    },
  };
};

export const RiskZone = mongoose.model('RiskZone', riskZoneSchema);
