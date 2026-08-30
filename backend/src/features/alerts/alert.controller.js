import * as alertService from './alert.service.js';
import { WeatherAlert } from './alert.model.js';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { ApiResponse } from '../../common/utils/ApiResponse.js';
import { ApiError } from '../../common/utils/ApiError.js';
import { httpStatusCodes } from '../../common/constants/httpStatusCodes.js';
import mongoose from 'mongoose';

/**
 * Trigger an on-demand weather scan & hazard evaluation.
 * POST /api/v1/alerts/scan
 */
export const runManualScan = asyncHandler(async (req, res) => {
  const latitude = req.body?.latitude ?? req.query?.lat ?? -6.2;
  const longitude = req.body?.longitude ?? req.query?.lng ?? 106.8;
  const scanRadiusKm = req.body?.scanRadiusKm ?? req.query?.radius ?? 15;
  const customThreshold = req.body?.threshold ?? req.query?.threshold ?? null;
  const forceQuery = req.body?.forceQuery ?? true;

  const result = await alertService.executeAutomatedWeatherScan(Number(latitude), Number(longitude), {
    scanRadiusKm: Number(scanRadiusKm),
    customThreshold: customThreshold ? Number(customThreshold) : null,
    forceQuery: Boolean(forceQuery),
  });

  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, result, 'Weather telemetry scanned & hazard evaluation completed')
  );
});

/**
 * Get live weather metrics and calculated hazard score without creating an alert.
 * GET /api/v1/alerts/telemetry
 */
export const getLiveTelemetry = asyncHandler(async (req, res) => {
  const lat = req.query?.lat ? Number(req.query.lat) : -6.2;
  const lng = req.query?.lng ? Number(req.query.lng) : 106.8;

  const weatherData = await alertService.fetchWeatherData(lat, lng);
  const scoring = alertService.calculateHazardConfidenceScore(weatherData);
  const evaluation = alertService.evaluateThreshold(scoring.score);

  res.status(httpStatusCodes.OK).json(
    new ApiResponse(
      httpStatusCodes.OK,
      {
        weatherData,
        hazardConfidenceScore: scoring.score,
        severity: scoring.severity,
        breakdown: scoring.breakdown,
        threshold: evaluation.threshold,
        isTriggered: evaluation.isTriggered,
      },
      'Live weather telemetry & hazard confidence score retrieved'
    )
  );
});

/**
 * List all active/historical weather alerts.
 * GET /api/v1/alerts
 */
export const listAlerts = asyncHandler(async (req, res) => {
  const { status, severity, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (status) filter.status = status.toUpperCase();
  if (severity) filter.severity = severity.toUpperCase();

  const skip = (Number(page) - 1) * Number(limit);

  const [alerts, total] = await Promise.all([
    WeatherAlert.find(filter)
      .populate('affectedZones', 'name zoneId riskLevel population center')
      .sort({ dispatchedAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    WeatherAlert.countDocuments(filter),
  ]);

  res.status(httpStatusCodes.OK).json(
    new ApiResponse(
      httpStatusCodes.OK,
      {
        alerts,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)) || 1,
        },
      },
      'Weather alerts fetched successfully'
    )
  );
});

/**
 * Get a specific alert by alertId or MongoDB _id.
 * GET /api/v1/alerts/:id
 */
export const getAlertById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const query = mongoose.isValidObjectId(id) ? { _id: id } : { alertId: id.toUpperCase() };

  const alert = await WeatherAlert.findOne(query)
    .populate('affectedZones')
    .lean();

  if (!alert) {
    throw new ApiError(httpStatusCodes.NOT_FOUND, `Weather alert "${id}" not found`);
  }

  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, alert, 'Weather alert details retrieved')
  );
});

/**
 * Dismiss or resolve an active alert.
 * PATCH /api/v1/alerts/:id/dismiss
 */
export const dismissAlert = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const query = mongoose.isValidObjectId(id) ? { _id: id } : { alertId: id.toUpperCase() };

  const alert = await WeatherAlert.findOne(query);

  if (!alert) {
    throw new ApiError(httpStatusCodes.NOT_FOUND, `Weather alert "${id}" not found`);
  }

  alert.status = 'DISMISSED';
  alert.dismissedAt = new Date();
  alert.dismissedBy = req.user?.id || null;
  await alert.save();

  res.status(httpStatusCodes.OK).json(
    new ApiResponse(httpStatusCodes.OK, alert, 'Weather alert status updated to DISMISSED')
  );
});

export default {
  runManualScan,
  getLiveTelemetry,
  listAlerts,
  getAlertById,
  dismissAlert,
};
