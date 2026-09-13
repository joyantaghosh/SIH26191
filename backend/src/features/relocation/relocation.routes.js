import { Router } from 'express';
import * as controller from './relocation.controller.js';
import * as v from './relocation.validation.js';
import { validate } from '../../common/middlewares/validate.middleware.js';

const router = Router();

// GET /api/v1/relocation/options - Get starting points, safe shelters & hazard zones
router.get('/options', controller.getOptions);

// GET /api/v1/relocation/priorities - Get ranked relocation priority matrix
router.get('/priorities', controller.getPriorities);


// POST /api/v1/relocation/calculate - Compute scored relocation routes & safe path
router.post('/calculate', validate(v.calculateRelocationSchema), controller.calculate);

// GET /api/v1/relocation/history - Get recent relocation runs
router.get('/history', controller.getHistory);

// GET /api/v1/relocation/:id - Get specific relocation calculation by ID
router.get('/:id', validate(v.getRelocationByIdSchema), controller.getById);

export default router;
