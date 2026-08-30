import { Router } from 'express';
import { validate } from '../../common/middlewares/validate.middleware.js';
import { protect, restrictTo } from '../auth/auth.middleware.js'; // adjust names to your exports
import * as v from './riskZone.validation.js';
import * as controller from './riskZone.controller.js';

const router = Router();

// Public read endpoints (the dashboard map consumes these)
router.get('/', validate(v.listRiskZones), controller.list);
router.get('/geojson', validate(v.listRiskZones), controller.listGeoJSON);
router.get('/stats/summary', controller.summary);
router.get('/:id', validate(v.getRiskZone), controller.getOne);

// Protected write endpoints (officers/admins)
router.use(protect);
router.post('/', restrictTo('admin', 'officer'), validate(v.createRiskZone), controller.create);
router.patch('/:id', restrictTo('admin', 'officer'), validate(v.updateRiskZone), controller.update);
router.delete('/:id', restrictTo('admin'), validate(v.deleteRiskZone), controller.remove);

export default router;
