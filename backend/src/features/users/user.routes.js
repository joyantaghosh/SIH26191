import { Router } from 'express';
import {
  getMe,
  updateMe,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from './user.controller.js';
import { validate } from '../../common/middlewares/validate.middleware.js';
import {
  updateUserSchema,
  listUsersQuerySchema,
  userIdParamSchema,
} from './user.validation.js';
import { protect, restrictTo } from '../auth/auth.middleware.js';

const router = Router();

// All routes below require authentication
router.use(protect);

router.get('/me', getMe);
router.patch('/me', validate(updateUserSchema), updateMe);

// Admin only routes
router.get('/', restrictTo('admin'), validate(listUsersQuerySchema, 'query'), getUsers);
router.get('/:id', restrictTo('admin'), validate(userIdParamSchema, 'params'), getUserById);
router.patch(
  '/:id',
  restrictTo('admin'),
  validate(userIdParamSchema, 'params'),
  validate(updateUserSchema),
  updateUserById
);
router.delete('/:id', restrictTo('admin'), validate(userIdParamSchema, 'params'), deleteUserById);

export default router;
