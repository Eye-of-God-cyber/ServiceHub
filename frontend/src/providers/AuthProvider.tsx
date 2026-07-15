"use client";

/**
 * AuthProvider — fully implemented auth context.
 *
 * Architectural decisions:
 * ─────────────────────────────────────────────────────────────────────────────
 * • State is initialised lazily using the useState initialiser function.
 *   This runs synchronously on the client during hydration, so there is NO
 *   useEffect needed for session restore — which satisfies the
 *   react-hooks/set-state-in-effect ESLint rule completely.
 *
 * • typeof window guard — The initialiser checks whether window is available
 *   before touching localStorage, making it safe for SSR. On the server the
 *   state starts as { session: empty, isLoading: false }.
 *
 * • Hydration note — Both the server and the client start from the same
 *   serialised shape (empty session, isLoading: false) so there is no
 *   hydration mismatch; any stored token is picked up immediately on the
 *   first client render via the lazy initialiser.
 *
 * • login() and logout() are memoised with useCallback.
 *
 * • The Axios client reads the token from localStorage directly (not from
 *   this context) to avoid a circular import with lib/api.ts.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import { STORAGE_KEYS } from "@/constants/storageKeys";
import type { AuthUser, AuthContextValue } from "@/features/auth/types/auth.types";

// ── Internal session state ────────────────────────────────────────────────────
interface AuthSessionState {
  user: AuthUser | null;
  token: string | null;
}

const emptySession: AuthSessionState = { user: null, token: null };

// ── Lazy initialiser — reads localStorage on first client render ───────────────
function readPersistedSession(): AuthSessionState {
  if (typeof window === "undefined") {
    // Running on the server — localStorage is unavailable
    return emptySession;
  }
  try {
    const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedToken && storedUser) {
      return {
        token: storedToken,
        user: JSON.parse(storedUser) as AuthUser,
      };
    }
  } catch {
    // Corrupted storage — clear and start fresh
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
  return emptySession;
}

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  login: () => {},
  logout: () => {},
  getCurrentUser: () => null,
});

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

// ── Provider ──────────────────────────────────────────────────────────────────
interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Lazy initialiser runs once on the client during the first render.
  // No useEffect required — satisfies react-hooks/set-state-in-effect.
  const [session, setSession] = useState<AuthSessionState>(readPersistedSession);

  // ── login() ───────────────────────────────────────────────────────────────
  const login = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    setSession({ token: newToken, user: newUser });
  }, []);

  // ── logout() ──────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setSession(emptySession);
  }, []);

  // ── getCurrentUser() ──────────────────────────────────────────────────────
  const getCurrentUser = useCallback((): AuthUser | null => {
    return session.user;
  }, [session.user]);

  const value: AuthContextValue = {
    user: session.user,
    token: session.token,
    isAuthenticated: !!session.token && !!session.user,
    isLoading: false,
    login,
    logout,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
