import mongoose from 'mongoose';

const { Schema } = mongoose;

export const ALERT_SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
export const ALERT_STATUSES = ['ACTIVE', 'RESOLVED', 'DISMISSED'];
export const NOTIFICATION_CHANNELS = ['WEBSOCKET', 'SMS', 'EMAIL', 'PUSH'];

const notificationLogSchema = new Schema(
  {
    channel: { type: String, enum: NOTIFICATION_CHANNELS, required: true },
    status: { type: String, enum: ['DISPATCHED', 'FAILED', 'PENDING'], default: 'DISPATCHED' },
    recipientCount: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
    detail: { type: String, default: '' },
  },
  { _id: false }
);

const affectedZoneSnapshotSchema = new Schema(
  {
    zoneId: { type: String, required: true },
    name: { type: String, required: true },
    riskLevel: { type: String, default: 'warning' },
    population: { type: Number, default: 0 },
    coordinates: { type: [Number], required: true }, // [lng, lat]
    distanceKm: { type: Number, default: 0 },
  },
  { _id: false }
);

const weatherTelemetrySnapshotSchema = new Schema(
  {
    temperature: { type: Number, default: 0 }, // °C
    humidity: { type: Number, default: 0 }, // %
    rainIntensityMmHr: { type: Number, default: 0 }, // mm/h
    rainAccumulation3hMm: { type: Number, default: 0 }, // mm
    windSpeedMs: { type: Number, default: 0 }, // m/s
    windGustMs: { type: Number, default: 0 }, // m/s
    pressureHpa: { type: Number, default: 1013 }, // hPa
    condition: { type: String, default: 'Clear' },
    locationName: { type: String, default: '' },
    dataSource: { type: String, default: 'OpenWeatherMap' },
  },
  { _id: false }
);

const weatherAlertSchema = new Schema(
  {
    alertId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    severity: {
      type: String,
      enum: ALERT_SEVERITIES,
      required: true,
      index: true,
    },
    hazardConfidenceScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
      index: true,
    },
    threshold: {
      type: Number,
      required: true,
      default: 60,
    },
    targetLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
        validate: {
          validator: (v) =>
            Array.isArray(v) &&
            v.length === 2 &&
            v[0] >= -180 &&
            v[0] <= 180 &&
            v[1] >= -90 &&
            v[1] <= 90,
          message: 'targetLocation.coordinates must be [longitude, latitude]',
        },
      },
    },
    scanRadiusKm: {
      type: Number,
      default: 15,
    },
    weatherData: {
      type: weatherTelemetrySnapshotSchema,
      required: true,
    },
    affectedZones: [
      {
        type: Schema.Types.ObjectId,
        ref: 'RiskZone',
      },
    ],
    affectedZoneSnapshots: [affectedZoneSnapshotSchema],
    totalPopulationAtRisk: {
      type: Number,
      default: 0,
    },
    notificationChannels: [notificationLogSchema],
    status: {
      type: String,
      enum: ALERT_STATUSES,
      default: 'ACTIVE',
      index: true,
    },
    dispatchedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours expiration
    },
    dismissedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    dismissedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

// 2dsphere index for location queries
weatherAlertSchema.index({ targetLocation: '2dsphere' });
weatherAlertSchema.index({ status: 1, hazardConfidenceScore: -1 });

export const WeatherAlert = mongoose.model('WeatherAlert', weatherAlertSchema);

export default WeatherAlert;
