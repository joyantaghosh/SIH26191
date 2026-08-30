import { ApiError } from '../utils/ApiError.js';
import { httpStatusCodes } from '../constants/httpStatusCodes.js';

/**
 * Generic Joi validation middleware.
 * Supports:
 * 1. Single Joi schema with target property: validate(schema, 'body' | 'query' | 'params')
 * 2. Multi-part schema object: validate({ params: schema, query: schema, body: schema })
 *
 * @param {import('joi').ObjectSchema | { body?: import('joi').ObjectSchema, params?: import('joi').ObjectSchema, query?: import('joi').ObjectSchema }} schema
 * @param {'body'|'params'|'query'} property
 */
export const validate = (schema, property = 'body') => (req, res, next) => {
  if (!schema) return next();

  // If schema is a direct Joi schema
  if (typeof schema.validate === 'function') {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message.replace(/"/g, ''));
      return next(new ApiError(httpStatusCodes.UNPROCESSABLE_ENTITY, 'Validation failed', errors));
    }

    req[property] = value;
    return next();
  }

  // If schema is an object containing { params, query, body }
  const validProperties = ['params', 'query', 'body'];
  const allErrors = [];

  for (const prop of validProperties) {
    if (schema[prop] && typeof schema[prop].validate === 'function') {
      const { error, value } = schema[prop].validate(req[prop], {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errors = error.details.map((detail) => detail.message.replace(/"/g, ''));
        allErrors.push(...errors);
      } else {
        req[prop] = value;
      }
    }
  }

  if (allErrors.length > 0) {
    return next(new ApiError(httpStatusCodes.UNPROCESSABLE_ENTITY, 'Validation failed', allErrors));
  }

  next();
};

export default validate;

