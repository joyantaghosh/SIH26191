import { Router } from 'express';
import * as controller from './evacuation.controller.js';

const router = Router();

// GET /api/v1/evacuation/options - Get origins, relief centers & hazard points
router.get('/options', controller.getOptions);

// GET /api/v1/evacuation/routes - Precomputed evacuation routes and waypoints
router.get('/routes', controller.getRoutes);


// POST /api/v1/evacuation/calculate - Calculate scored evacuation corridors
router.post('/calculate', controller.calculate);

// GET /api/v1/evacuation/plans - History of recent evacuation plans
router.get('/plans', controller.listPlans);

export default router;
