import Joi from 'joi';

const objectIdOrString = Joi.string().trim().min(1).max(100);

export const calculateRelocationSchema = {
  body: Joi.object({
    startLocationId: objectIdOrString.required().messages({
      'any.required': 'startLocationId is required',
    }),
    destinationLocationId: objectIdOrString.required().messages({
      'any.required': 'destinationLocationId is required',
    }),
  }),
};

export const getRelocationByIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({ 'string.pattern.base': 'Invalid relocation ID' }),
  }),
};

export default {
  calculateRelocationSchema,
  getRelocationByIdSchema,
};
