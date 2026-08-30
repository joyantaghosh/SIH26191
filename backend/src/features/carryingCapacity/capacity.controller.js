import * as capacityService from './capacity.service.js';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { ApiResponse } from '../../common/utils/ApiResponse.js';
import { httpStatusCodes } from '../../common/constants/httpStatusCodes.js';

export const listSectors = asyncHandler(async (req, res) => {
  const sectors = await capacityService.getCapacitySectors();
  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, sectors, 'Capacity sectors fetched successfully')
  );
});

export const calculate = asyncHandler(async (req, res) => {
  const result = await capacityService.calculateCarryingCapacity(req.body);
  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, result, 'Carrying capacity assessment completed')
  );
});

export const getHistory = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const history = await capacityService.getAssessmentHistory(limit);
  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, history, 'Capacity assessments retrieved')
  );
});

export default {
  listSectors,
  calculate,
  getHistory,
};
