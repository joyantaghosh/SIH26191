const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : 'https://safezones-backend.onrender.com/api/v1');


const getBaseUrl = () => {
  let url = API_BASE_URL.trim().replace(/\/+$/, '');
  if (!url.includes('/api/v1') && !url.includes('/api')) {
    url = `${url}/api/v1`;
  }
  return url;
};

/**
 * Get stored authentication token
 */
export function getStoredToken() {
  return localStorage.getItem('safezones_access_token') || null;
}

/**
 * Get stored user profile
 */
export function getStoredUser() {
  try {
    const raw = localStorage.getItem('safezones_user');
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

/**
 * Store auth session
 */
export function setStoredSession(token, user) {
  if (token) localStorage.setItem('safezones_access_token', token);
  if (user) localStorage.setItem('safezones_user', JSON.stringify(user));
}

/**
 * Clear stored session
 */
export function clearStoredSession() {
  localStorage.removeItem('safezones_access_token');
  localStorage.removeItem('safezones_user');
  localStorage.removeItem('safezones_refresh_token');
}

/**
 * Helper to execute authorized API requests
 */
export async function authFetch(path, options = {}) {
  const base = getBaseUrl();
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * User Login
 */
export async function loginUser(email, password) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || 'Login failed. Please check your credentials.');
  }

  const payload = body.data || body;
  const user = payload.user || payload;
  const accessToken = payload.accessToken || payload.token;

  if (accessToken) {
    setStoredSession(accessToken, user);
  }

  return { user, accessToken };
}

/**
 * User Registration
 */
export async function registerUser({ name, email, password }) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ name, email, password }),
    credentials: 'include',
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || 'Registration failed. Please check your input.');
  }

  const payload = body.data || body;
  const user = payload.user || payload;
  const accessToken = payload.accessToken || payload.token;

  if (accessToken) {
    setStoredSession(accessToken, user);
  }

  return { user, accessToken };
}

/**
 * Fetch Current Authenticated User Session
 */
export async function fetchCurrentSession() {
  try {
    const data = await authFetch('/users/me');
    const user = data.data || data;
    if (user) {
      localStorage.setItem('safezones_user', JSON.stringify(user));
    }
    return user;
  } catch (err) {
    clearStoredSession();
    throw err;
  }
}

/**
 * User Logout
 */
export async function logoutUser() {
  try {
    await authFetch('/auth/logout', { method: 'POST' });
  } catch (_) {
    // Ignore network errors during logout
  } finally {
    clearStoredSession();
  }
}

/**
 * Google OAuth URL
 */
export function getGoogleOAuthUrl() {
  const base = getBaseUrl();
  return `${base}/auth/google`;
}

export default {
  loginUser,
  registerUser,
  fetchCurrentSession,
  logoutUser,
  getStoredToken,
  getStoredUser,
  setStoredSession,
  clearStoredSession,
  getGoogleOAuthUrl,
  authFetch,
};
