import { ApiError } from '../utils/ApiError.js';
import { httpStatusCodes } from '../constants/httpStatusCodes.js';
import 'dotenv/config';


export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    error = new ApiError(
      httpStatusCodes.CONFLICT,
      `${field ? field : 'Field'} already exists`,
      []
    );
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    error = new ApiError(httpStatusCodes.BAD_REQUEST, `Invalid ${err.path}: ${err.value}`);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors?.length ? error.errors : undefined,
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
  };

  res.status(error.statusCode || httpStatusCodes.INTERNAL_SERVER_ERROR).json(response);
};

export default errorHandler;
