import * as relocationService from './relocation.service.js';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { ApiResponse } from '../../common/utils/ApiResponse.js';
import { httpStatusCodes } from '../../common/constants/httpStatusCodes.js';

export const getOptions = asyncHandler(async (req, res) => {
  const options = await relocationService.getRelocationOptions();
  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, options, 'Relocation options fetched successfully')
  );
});

export const getPriorities = asyncHandler(async (req, res) => {
  const priorities = await relocationService.getRelocationPriorities(req.query);
  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, priorities, 'Relocation priority matrix fetched successfully')
  );
});


export const calculate = asyncHandler(async (req, res) => {
  const { startLocationId, destinationLocationId } = req.body;
  const result = await relocationService.calculateRelocation(startLocationId, destinationLocationId);
  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, result, 'Relocation route calculated successfully')
  );
});

export const getHistory = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
  const history = await relocationService.getRecentRelocations(limit);
  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, history, 'Relocation history fetched successfully')
  );
});

export const getById = asyncHandler(async (req, res) => {
  const relocation = await relocationService.getRelocationById(req.params.id);
  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, relocation, 'Relocation run fetched successfully')
  );
});

export default {
  getOptions,
  getPriorities,
  calculate,
  getHistory,
  getById,
};

