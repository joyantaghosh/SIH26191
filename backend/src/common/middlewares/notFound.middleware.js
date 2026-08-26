import { ApiError } from '../utils/ApiError.js';
import { httpStatusCodes } from '../constants/httpStatusCodes.js';

export const notFound = (req, res, next) => {
  next(new ApiError(httpStatusCodes.NOT_FOUND, `Route not found: ${req.originalUrl}`));
};

export default notFound;
