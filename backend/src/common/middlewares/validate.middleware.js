import { ApiError } from '../utils/ApiError.js';
import { httpStatusCodes } from '../constants/httpStatusCodes.js';

/**
 * Generic Joi validation middleware.
 * @param {import('joi').ObjectSchema} schema
 * @param {'body'|'params'|'query'} property
 */
export const validate = (schema, property = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message.replace(/"/g, ''));
    return next(new ApiError(httpStatusCodes.UNPROCESSABLE_ENTITY, 'Validation failed', errors));
  }

  req[property] = value;
  next();
};

export default validate;
