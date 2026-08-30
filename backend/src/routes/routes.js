import { Router } from 'express';
import authRoutes from '../features/auth/auth.routes.js';
import userRoutes from '../features/users/user.routes.js';
import riskZoneRoutes from '../features/riskZones/riskZone.routes.js';
import relocationRoutes from '../features/relocation/relocation.routes.js';
import alertRoutes from '../features/alerts/alert.routes.js';
import evacuationRoutes from '../features/evacuation/evacuation.routes.js';
import capacityRoutes from '../features/carryingCapacity/capacity.routes.js';
import settlementRoutes from '../features/settlements/settlement.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/risk-zones', riskZoneRoutes);
router.use('/relocation', relocationRoutes);
router.use('/alerts', alertRoutes);
router.use('/evacuation', evacuationRoutes);
router.use('/capacity', capacityRoutes);
router.use('/settlements', settlementRoutes);

export default router;
