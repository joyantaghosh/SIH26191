import { Router } from 'express';
import passport from '../../config/passport.config.js';
import {
  register,
  login,
  refreshToken,
  logout,
  getCurrentSession,
  googleCallback,
} from './auth.controller.js';
import { validate } from '../../common/middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from './auth.validation.js';
import { protect } from './auth.middleware.js';

const router = Router();

// Local email/password auth
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getCurrentSession);

// Google OAuth 2.0
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/v1/auth/google/failure' }),
  googleCallback
);    

router.get('/google/failure', (req, res) => {
  res.status(401).json({ success: false, message: 'Google authentication failed' });
});

export default router;
