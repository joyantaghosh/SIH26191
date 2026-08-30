import { Router } from 'express';
import * as controller from './settlement.controller.js';
import * as v from './settlement.validation.js';
import { validate } from '../../common/middlewares/validate.middleware.js';

const router = Router();

// GET /api/v1/settlements/stats/summary - Summary count stats
router.get('/stats/summary', controller.getStats);

// GET /api/v1/settlements - List settlements with filtering & pagination
router.get('/', validate(v.listSettlementsSchema), controller.listSettlements);

// GET /api/v1/settlements/:id - Get settlement details
router.get('/:id', validate(v.settlementIdParamSchema), controller.getSettlementById);

// POST /api/v1/settlements - Create new settlement record
router.post('/', validate(v.createSettlementSchema), controller.createSettlement);

// PATCH /api/v1/settlements/:id - Update settlement
router.patch('/:id', validate(v.settlementIdParamSchema), controller.updateSettlement);

// DELETE /api/v1/settlements/:id - Deactivate settlement
router.delete('/:id', validate(v.settlementIdParamSchema), controller.deleteSettlement);

export default router;
