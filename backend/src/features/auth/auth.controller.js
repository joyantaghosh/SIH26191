import authService from './auth.service.js';
import { ApiResponse } from '../../common/utils/ApiResponse.js';
import { ApiError } from '../../common/utils/ApiError.js';
import { httpStatusCodes } from '../../common/constants/httpStatusCodes.js';
import { messages } from '../../common/constants/messages.js';
import 'dotenv/config';
import asyncHandler from '../../common/utils/asyncHandler.js';

const REFRESH_COOKIE_NAME = 'refreshToken';
const ACCESS_COOKIE_NAME = 'accessToken';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

const setAuthCookies = (res, { accessToken, refreshToken }) => {
  res.cookie(ACCESS_COOKIE_NAME, accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  if (refreshToken) {
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
};

const clearAuthCookies = (res) => {
  res.clearCookie(ACCESS_COOKIE_NAME, cookieOptions);
  res.clearCookie(REFRESH_COOKIE_NAME, cookieOptions);
};

export const register = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.register(req.body);
  setAuthCookies(res, tokens);
  res
    .status(httpStatusCodes.CREATED)
    .json(new ApiResponse(httpStatusCodes.CREATED, { user, ...tokens }, messages.AUTH.REGISTER_SUCCESS));
});

export const login = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.login(req.body);
  setAuthCookies(res, tokens);
  res
    .status(httpStatusCodes.OK)
    .json(new ApiResponse(httpStatusCodes.OK, { user, ...tokens }, messages.AUTH.LOGIN_SUCCESS));
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.body?.refreshToken || req.cookies?.[REFRESH_COOKIE_NAME];
  const { accessToken, user } = await authService.refreshAccessToken(token);
  setAuthCookies(res, { accessToken });
  res
    .status(httpStatusCodes.OK)
    .json(new ApiResponse(httpStatusCodes.OK, { accessToken, user }, messages.AUTH.REFRESH_SUCCESS));
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user?.id);
  clearAuthCookies(res);
  res.status(httpStatusCodes.OK).json(new ApiResponse(httpStatusCodes.OK, null, messages.AUTH.LOGOUT_SUCCESS));
});

export const getCurrentSession = asyncHandler(async (req, res) => {
  res.status(httpStatusCodes.OK).json(new ApiResponse(httpStatusCodes.OK, req.user, 'Current session'));
});

/**
 * Called by passport after Google authenticates the user (req.user is a
 * Mongoose User document at this point, set by passport's verify callback).
 * Redirects back to the client with tokens, or issues cookies + JSON.
 */
export const googleCallback = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(httpStatusCodes.UNAUTHORIZED, messages.AUTH.INVALID_CREDENTIALS);
  }

  const { user, tokens } = await authService.loginWithGoogleProfile(req.user);
  setAuthCookies(res, tokens);

  // Redirect to the frontend with tokens in the query string so an SPA can
  // pick them up, while cookies are also set for same-site usage.
  const clientBase = (process.env.CLIENT_URL && process.env.CLIENT_URL.trim()) || 'http://localhost:5173';
  const redirectUrl = new URL('/oauth/success', clientBase);
  redirectUrl.searchParams.set('accessToken', tokens.accessToken);
  redirectUrl.searchParams.set('refreshToken', tokens.refreshToken);

  if (req.query.format === 'json') {
    return res
      .status(httpStatusCodes.OK)
      .json(new ApiResponse(httpStatusCodes.OK, { user, ...tokens }, messages.AUTH.LOGIN_SUCCESS));
  }

  return res.redirect(redirectUrl.toString());

});

export default {
  register,
  login,
  refreshToken,
  logout,
  getCurrentSession,
  googleCallback,
};
