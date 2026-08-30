import * as settlementService from './settlement.service.js';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { ApiResponse } from '../../common/utils/ApiResponse.js';
import { httpStatusCodes } from '../../common/constants/httpStatusCodes.js';

export const listSettlements = asyncHandler(async (req, res) => {
  const result = await settlementService.querySettlements(req.query);
  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, result, 'Settlements fetched successfully')
  );
});

export const getSettlementById = asyncHandler(async (req, res) => {
  const settlement = await settlementService.getSettlementById(req.params.id);
  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, settlement, 'Settlement details retrieved')
  );
});

export const getStats = asyncHandler(async (req, res) => {
  const stats = await settlementService.getSettlementSummaryStats();
  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, stats, 'Settlement overview statistics retrieved')
  );
});

export const createSettlement = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    location: {
      type: 'Point',
      coordinates: [req.body.longitude || 106.8, req.body.latitude || -6.2],
    },
  };
  const created = await settlementService.createSettlement(payload);
  res.status(httpStatusCodes.CREATED).json(
    new ApiResponse(httpStatusCodes.CREATED, created, 'Settlement created successfully')
  );
});

export const updateSettlement = asyncHandler(async (req, res) => {
  const updated = await settlementService.updateSettlement(req.params.id, req.body);
  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, updated, 'Settlement updated successfully')
  );
});

export const deleteSettlement = asyncHandler(async (req, res) => {
  const deleted = await settlementService.deleteSettlement(req.params.id);
  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, deleted, 'Settlement deactivated successfully')
  );
});

export default {
  listSettlements,
  getSettlementById,
  getStats,
  createSettlement,
  updateSettlement,
  deleteSettlement,
};
