import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  loginUser,
  registerUser,
  logoutUser,
  fetchCurrentSession,
  getStoredToken,
  getStoredUser,
  setStoredSession,
  clearStoredSession,
} from '../services/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(true);

  // Initialize session check on application boot
  useEffect(() => {
    let isMounted = true;
    const existingToken = getStoredToken();

    if (existingToken) {
      fetchCurrentSession()
        .then((userData) => {
          if (isMounted) {
            setUser(userData);
            setToken(existingToken);
          }
        })
        .catch(() => {
          if (isMounted) {
            setUser(null);
            setToken(null);
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await loginUser(email, password);
    setUser(res.user);
    setToken(res.accessToken);
    return res;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const res = await registerUser({ name, email, password });
    setUser(res.user);
    setToken(res.accessToken);
    return res;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    setToken(null);
  }, []);

  const handleOAuthSuccess = useCallback((accessToken, userProfile = null) => {
    if (accessToken) {
      setStoredSession(accessToken, userProfile);
      setToken(accessToken);
      if (userProfile) {
        setUser(userProfile);
      } else {
        fetchCurrentSession().then(setUser).catch(() => {});
      }
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
    handleOAuthSuccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
