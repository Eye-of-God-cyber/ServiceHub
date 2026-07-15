/**
 * Auth feature type definitions.
 *
 * These mirror the exact response shapes returned by the backend auth service.
 * Any field change in the backend MUST be reflected here.
 */

import { Role } from "@/constants/roles";

// ── Login response data (nested inside ApiResponse.data) ──────────────────────
export interface AuthUser {
  id: string;
  email: string;
  phone: string;
  role: Role;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

export interface LoginResponseData {
  accessToken: string;
  user: AuthUser;
}

// ── Register response data ─────────────────────────────────────────────────────
export interface RegisterResponseData {
  id: string;
  email: string;
  phone: string;
  role: Role;
  status: string;
  createdAt: string;
}

// ── Auth context state ─────────────────────────────────────────────────────────
export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ── Auth context value (functions + state) ─────────────────────────────────────
export interface AuthContextValue extends AuthState {
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  getCurrentUser: () => AuthUser | null;
}
