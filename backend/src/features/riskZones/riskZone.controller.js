import { asyncHandler } from '../../common/utils/asyncHandler.js';
import * as riskZoneService from './riskZone.service.js';

export const list = asyncHandler(async (req, res) => {
  const { items, meta } = await riskZoneService.queryRiskZones(req.query);
  res.json({ success: true, data: items, meta });
});

export const listGeoJSON = asyncHandler(async (req, res) => {
  const fc = await riskZoneService.queryRiskZonesAsGeoJSON(req.query);
  res.type('application/geo+json').json(fc);
});

export const summary = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await riskZoneService.getSummary() });
});

export const getOne = asyncHandler(async (req, res) => {
  const zone = await riskZoneService.getRiskZoneByIdentifier(req.params.id);
  res.json({ success: true, data: zone });
});

export const create = asyncHandler(async (req, res) => {
  const zone = await riskZoneService.createRiskZone(req.body, req.user?.id);
  res.status(201).json({ success: true, data: zone });
});

export const update = asyncHandler(async (req, res) => {
  const zone = await riskZoneService.updateRiskZone(req.params.id, req.body);
  res.json({ success: true, data: zone });
});

export const remove = asyncHandler(async (req, res) => {
  await riskZoneService.deleteRiskZone(req.params.id);
  res.json({ success: true, message: 'Risk zone deactivated' });
});
