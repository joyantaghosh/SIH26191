import userRepository from '../users/user.repository.js';
import { toUserDTO } from '../users/user.dto.js';
import { ApiError } from '../../common/utils/ApiError.js';
import { httpStatusCodes } from '../../common/constants/httpStatusCodes.js';
import { messages } from '../../common/constants/messages.js';
import {
  generateAuthTokens,
  verifyRefreshToken,
  signAccessToken,
} from '../../common/utils/jwt.js';

class AuthService {
  async register({ name, email, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new ApiError(httpStatusCodes.CONFLICT, messages.AUTH.EMAIL_IN_USE);
    }

    const user = await userRepository.create({
      name,
      email,
      password,
      authProvider: 'local',
    });

    const tokens = generateAuthTokens(user);
    await userRepository.setRefreshToken(user._id, tokens.refreshToken);

    return { user: toUserDTO(user), tokens };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new ApiError(httpStatusCodes.UNAUTHORIZED, messages.AUTH.INVALID_CREDENTIALS);
    }

    if (user.authProvider === 'google' && !user.password) {
      throw new ApiError(httpStatusCodes.BAD_REQUEST, messages.AUTH.GOOGLE_ACCOUNT_ONLY);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(httpStatusCodes.UNAUTHORIZED, messages.AUTH.INVALID_CREDENTIALS);
    }

    const tokens = generateAuthTokens(user);
    await userRepository.setRefreshToken(user._id, tokens.refreshToken);

    return { user: toUserDTO(user), tokens };
  }

  /**
   * Called after a successful Google OAuth handshake (req.user already
   * resolved by the passport Google strategy).
   */
  async loginWithGoogleProfile(user) {
    const tokens = generateAuthTokens(user);
    await userRepository.setRefreshToken(user._id, tokens.refreshToken);
    return { user: toUserDTO(user), tokens };
  }

  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new ApiError(httpStatusCodes.UNAUTHORIZED, messages.AUTH.NO_REFRESH_TOKEN);
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new ApiError(httpStatusCodes.UNAUTHORIZED, messages.AUTH.INVALID_TOKEN);
    }

    const user = await userRepository.findByIdWithPassword(decoded.sub);
    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(httpStatusCodes.UNAUTHORIZED, messages.AUTH.INVALID_TOKEN);
    }

    const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
    return { accessToken, user: toUserDTO(user) };
  }

  async logout(userId) {
    if (userId) {
      await userRepository.setRefreshToken(userId, null);
    }
  }
}

export const authService = new AuthService();

export default authService;
