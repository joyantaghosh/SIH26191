import Joi from 'joi';

export const listSettlementsSchema = {
  query: Joi.object({
    district: Joi.string().allow(''),
    riskLevel: Joi.string().valid('all', 'critical', 'warning', 'safe', 'Critical', 'Warning', 'Safe').default('all'),
    search: Joi.string().allow(''),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(50),
  }),
};

export const settlementIdParamSchema = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

export const createSettlementSchema = {
  body: Joi.object({
    settlementId: Joi.string().required(),
    name: Joi.string().required(),
    district: Joi.string().required(),
    riskLevel: Joi.string().valid('Critical', 'Warning', 'Safe').required(),
    population: Joi.number().min(0).required(),
    vulnerabilityScore: Joi.number().min(0).max(100).required(),
    hazardType: Joi.string().default('Terrain Landslide'),
    distanceToHazardKm: Joi.number().min(0).default(1.0),
    routeStatus: Joi.string().default('Clear'),
    progress: Joi.number().min(0).max(100).default(50),
    latitude: Joi.number().min(-90).max(90).default(-6.2),
    longitude: Joi.number().min(-180).max(180).default(106.8),
  }),
};

export default {
  listSettlementsSchema,
  settlementIdParamSchema,
  createSettlementSchema,
};
