import * as mlProxyService from './mlProxy.service.js';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { ApiResponse } from '../../common/utils/ApiResponse.js';
import { httpStatusCodes } from '../../common/constants/httpStatusCodes.js';

export const syncData = asyncHandler(async (req, res) => {
  const result = await mlProxyService.syncAllMLData();
  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, result, 'ML Proxy datasets synchronized into MongoDB successfully')
  );
});

export const getStatus = asyncHandler(async (req, res) => {
  const status = await mlProxyService.getMLStatus();
  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, status, 'ML Proxy integration status fetched successfully')
  );
});

export const getRawData = asyncHandler(async (req, res) => {
  const { dataset } = req.params;
  const filenameMap = {
    'risk-zones': { file: 'riskZones.json', path: '/api/ml/risk-zones' },
    capacity: { file: 'carryingCapacity.json', path: '/api/ml/capacity' },
    relocation: { file: 'relocationPriorities.json', path: '/api/ml/relocation' },
    routes: { file: 'evacuationRoutes.json', path: '/api/ml/routes' },
  };

  const target = filenameMap[dataset];
  if (!target) {
    return res.status(httpStatusCodes.NOT_FOUND).json(
      new ApiResponse(httpStatusCodes.NOT_FOUND, null, `Dataset "${dataset}" not found. Available: risk-zones, capacity, relocation, routes`)
    );
  }

  const { source, data } = await mlProxyService.loadMLDataset(target.file, target.path);
  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, { source, count: data.length, data }, `Dataset ${dataset} fetched successfully`)
  );
});

export default {
  syncData,
  getStatus,
  getRawData,
};
