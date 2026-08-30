import { Router } from 'express';
import * as controller from './capacity.controller.js';

const router = Router();

// GET /api/v1/capacity/sectors - List refuge sectors and baseline metrics
router.get('/sectors', controller.listSectors);

// POST /api/v1/capacity/calculate - Run carrying capacity calculation matrix
router.post('/calculate', controller.calculate);

// GET /api/v1/capacity/history - List past capacity assessments
router.get('/history', controller.getHistory);

export default router;
