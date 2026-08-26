import { verifyAccessToken } from '../../common/utils/jwt.js';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { ApiError } from '../../common/utils/ApiError.js';
import { httpStatusCodes } from '../../common/constants/httpStatusCodes.js';
import { messages } from '../../common/constants/messages.js';
import userRepository from '../users/user.repository.js';

/**
 * Protect routes - verifies the JWT access token sent either as:
 *  - Authorization: Bearer <token>  header, or
 *  - accessToken httpOnly cookie
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(httpStatusCodes.UNAUTHORIZED, messages.AUTH.NOT_AUTHENTICATED);
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (error) {
    throw new ApiError(httpStatusCodes.UNAUTHORIZED, messages.AUTH.INVALID_TOKEN);
  }

  const user = await userRepository.findById(decoded.sub);
  if (!user) {
    throw new ApiError(httpStatusCodes.UNAUTHORIZED, messages.AUTH.NOT_AUTHENTICATED);
  }

  req.user = { id: user._id.toString(), role: user.role, email: user.email };
  next();
});

/**
 * Restricts a route to the given list of roles. Use after `protect`.
 * @param  {...string} roles
 */
export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(httpStatusCodes.FORBIDDEN, messages.AUTH.FORBIDDEN));
    }
    next();
  };

export default { protect, restrictTo };
