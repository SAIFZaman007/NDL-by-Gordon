import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import apiClient, { AUTH_STORAGE_KEY } from '../api/client';

// Mirrors the backend's own hardcoded admin check
// (see backend/app/routers/admin_router.py -> verify_admin).
export const ADMIN_EMAIL = 'admin@gordon.com';

const AuthContext = createContext(null);

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  // Accepts the raw shape the backend already returns from
  // /auth/login, /auth/register and /auth/google:
  // { access_token, token_type, membership_level, email }
  const login = useCallback((tokenResponse) => {
    const session = {
      token: tokenResponse.access_token,
      email: tokenResponse.email,
      membershipLevel: tokenResponse.membership_level,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    setAuth(session);
    return session;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuth(null);
  }, []);

  // Re-pulls /auth/me and updates the stored membership level. Used after a
  // Stripe checkout completes, since the upgrade happens server-side.
  const refreshUser = useCallback(async () => {
    if (!auth?.token) return null;
    const res = await apiClient.get('/auth/me');
    const updated = { ...auth, membershipLevel: res.data.membership_level };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    setAuth(updated);
    return updated;
  }, [auth]);

  const value = useMemo(() => ({
    token: auth?.token || null,
    email: auth?.email || null,
    membershipLevel: auth?.membershipLevel || null,
    isAuthenticated: !!auth?.token,
    isAdmin: auth?.email === ADMIN_EMAIL,
    isPremium: auth?.membershipLevel === 'premium',
    login,
    logout,
    refreshUser,
  }), [auth, login, logout, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
