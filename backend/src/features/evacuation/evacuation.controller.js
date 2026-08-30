import * as evacuationService from './evacuation.service.js';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { ApiResponse } from '../../common/utils/ApiResponse.js';
import { httpStatusCodes } from '../../common/constants/httpStatusCodes.js';

export const getOptions = asyncHandler(async (req, res) => {
  const options = await evacuationService.getEvacuationOptions();
  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, options, 'Evacuation origins, shelters, and hazards fetched successfully')
  );
});

export const calculate = asyncHandler(async (req, res) => {
  const { startPoint, destination } = req.body;
  const result = await evacuationService.calculateEvacuationRoute(startPoint, destination);
  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, result, 'Evacuation transit routes calculated successfully')
  );
});

export const listPlans = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const plans = await evacuationService.getRecentPlans(limit);
  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, plans, 'Recent evacuation plans retrieved')
  );
});

export default {
  getOptions,
  calculate,
  listPlans,
};
