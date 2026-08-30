import Joi from 'joi';
import { RISK_LEVELS, HAZARD_TYPES } from './riskZone.model.js';

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);
const idOrZoneId = Joi.alternatives().try(objectId, Joi.string().pattern(/^[A-Za-z0-9-]{3,20}$/));

const centerSchema = Joi.object({
  type: Joi.string().valid('Point').default('Point'),
  coordinates: Joi.array().ordered(
    Joi.number().min(-180).max(180).required(),
    Joi.number().min(-90).max(90).required()
  ).length(2).required(),
});

const bodyBase = {
  zoneId: Joi.string().pattern(/^[A-Za-z0-9-]{3,20}$/),
  name: Joi.string().max(120),
  region: Joi.string().allow('').max(120),
  description: Joi.string().allow('').max(1000),
  hazardType: Joi.string().valid(...HAZARD_TYPES),
  riskLevel: Joi.string().valid(...RISK_LEVELS),
  vulnerabilityScore: Joi.number().min(0).max(100),
  severityIndex: Joi.number().min(0).max(10),
  metrics: Joi.object({
    severity: Joi.number().min(0).max(100),
    density: Joi.number().min(0).max(100),
    soilRisk: Joi.number().min(0).max(100),
  }),
  population: Joi.number().min(0),
  households: Joi.number().min(0),
  distanceToHazardKm: Joi.number().min(0),
  center: centerSchema,
  radiusMeters: Joi.number().min(10).max(200000),
  area: Joi.object({
    type: Joi.string().valid('Polygon', 'MultiPolygon').default('Polygon'),
    coordinates: Joi.array().required(),
  }),
  isActive: Joi.boolean(),
};

export const listRiskZones = {
  query: Joi.object({
    q: Joi.string().max(120),
    riskLevel: Joi.string(),            // "critical" or "critical,warning"
    hazardType: Joi.string(),
    region: Joi.string(),
    minScore: Joi.number().min(0).max(100),
    maxScore: Joi.number().min(0).max(100),
    isActive: Joi.boolean(),
    bbox: Joi.string().pattern(/^-?\d+(\.\d+)?(,-?\d+(\.\d+)?){3}$/), // minLng,minLat,maxLng,maxLat
    lat: Joi.number().min(-90).max(90),
    lng: Joi.number().min(-180).max(180),
    radius: Joi.number().min(1).max(500000).default(5000), // metres
    sort: Joi.string().default('-vulnerabilityScore'),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(500).default(50),
  }).and('lat', 'lng'),
};

export const getRiskZone = { params: Joi.object({ id: idOrZoneId.required() }) };

export const createRiskZone = {
  body: Joi.object(bodyBase).fork(
    ['zoneId', 'name', 'hazardType', 'riskLevel', 'vulnerabilityScore', 'severityIndex', 'center'],
    (s) => s.required()
  ),
};

export const updateRiskZone = {
  params: Joi.object({ id: idOrZoneId.required() }),
  body: Joi.object(bodyBase).min(1),
};

export const deleteRiskZone = getRiskZone;
