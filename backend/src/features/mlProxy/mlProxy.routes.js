import { Router } from 'express';
import * as controller from './mlProxy.controller.js';

const router = Router();

// POST /api/v1/ml-proxy/sync - Ingest/sync ML datasets directly into MongoDB
router.post('/sync', controller.syncData);

// GET /api/v1/ml-proxy/status - Get integration & database status
router.get('/status', controller.getStatus);

// GET /api/v1/ml-proxy/data/:dataset - Get raw dataset payload (risk-zones, capacity, relocation, routes)
router.get('/data/:dataset', controller.getRawData);

export default router;
