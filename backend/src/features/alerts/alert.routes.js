import { Router } from 'express';
import * as controller from './alert.controller.js';
import * as v from './alert.validation.js';
import { validate } from '../../common/middlewares/validate.middleware.js';

const router = Router();

// POST /api/v1/alerts/scan - Trigger on-demand weather scan & hazard evaluation
router.post('/scan', validate(v.scanWeatherSchema), controller.runManualScan);

// GET /api/v1/alerts/telemetry - Live weather telemetry & hazard score preview
router.get('/telemetry', validate(v.getTelemetrySchema), controller.getLiveTelemetry);

// GET /api/v1/alerts - List all weather alerts with pagination & filters
router.get('/', validate(v.listAlertsSchema), controller.listAlerts);

// GET /api/v1/alerts/:id - Get specific alert details by ID
router.get('/:id', validate(v.alertIdParamSchema), controller.getAlertById);

// PATCH /api/v1/alerts/:id/dismiss - Dismiss or resolve an active alert
router.patch('/:id/dismiss', validate(v.alertIdParamSchema), controller.dismissAlert);

export default router;
