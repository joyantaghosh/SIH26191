export const messages = {
  AUTH: {
    REGISTER_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Logged in successfully',
    LOGOUT_SUCCESS: 'Logged out successfully',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_IN_USE: 'Email is already registered',
    NOT_AUTHENTICATED: 'You are not logged in. Please log in to continue',
    INVALID_TOKEN: 'Invalid or expired token',
    REFRESH_SUCCESS: 'Access token refreshed successfully',
    NO_REFRESH_TOKEN: 'Refresh token missing',
    GOOGLE_ACCOUNT_ONLY: 'This account uses Google Sign-In. Please continue with Google',
    FORBIDDEN: 'You do not have permission to perform this action',
  },
  USER: {
    NOT_FOUND: 'User not found',
    FETCHED: 'User(s) fetched successfully',
    UPDATED: 'User updated successfully',
    DELETED: 'User deleted successfully',
  },
};

export default messages;
