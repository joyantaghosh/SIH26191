import Joi from 'joi';

export const scanWeatherSchema = {
  body: Joi.object({
    latitude: Joi.number().min(-90).max(90).default(-6.2),
    longitude: Joi.number().min(-180).max(180).default(106.8),
    scanRadiusKm: Joi.number().min(1).max(200).default(15),
    threshold: Joi.number().min(0).max(100),
    forceQuery: Joi.boolean().default(true),
  }),
};

export const getTelemetrySchema = {
  query: Joi.object({
    lat: Joi.number().min(-90).max(90).default(-6.2),
    lng: Joi.number().min(-180).max(180).default(106.8),
  }),
};

export const listAlertsSchema = {
  query: Joi.object({
    status: Joi.string().valid('ACTIVE', 'RESOLVED', 'DISMISSED'),
    severity: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
};

export const alertIdParamSchema = {
  params: Joi.object({
    id: Joi.string().required().messages({
      'any.required': 'Alert ID or MongoDB ObjectId is required',
    }),
  }),
};

export default {
  scanWeatherSchema,
  getTelemetrySchema,
  listAlertsSchema,
  alertIdParamSchema,
};
