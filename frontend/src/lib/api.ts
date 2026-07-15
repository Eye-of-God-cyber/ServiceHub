/**
 * Axios API client — ServiceHub frontend.
 *
 * Architectural decisions:
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Single instance — One axios instance for the entire app. Base URL and
 *    interceptors configured once.
 *
 * 2. baseURL from env — NEXT_PUBLIC_API_URL read at build time. Falls back to
 *    localhost:5000 for local development.
 *
 * 3. Timeout — 15 s prevents hung requests from blocking the UI.
 *
 * 4. Request interceptor — Reads the JWT from localStorage and injects it as
 *    an Authorization Bearer header. Reads directly from localStorage (not from
 *    AuthContext) to avoid a circular dependency between the Axios module and
 *    the React context tree.
 *
 * 5. Response interceptor — On 401, clears auth storage and redirects to the
 *    login page so the user is not stuck in an authenticated-but-rejected state.
 *    Does NOT call AuthProvider.logout() to avoid circular imports; it mirrors
 *    the same localStorage keys used by AuthProvider.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { ROUTES } from "@/constants/routes";

// ── Instance ──────────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1",
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Request Interceptor ───────────────────────────────────────────────────────
// Inject the JWT Bearer token on every outgoing request (if a token exists).
// Reading from localStorage directly avoids a circular import with AuthProvider.
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ── Response Interceptor ──────────────────────────────────────────────────────
// Handle global error cases that apply to every request in the app.
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      // Token expired or invalid — clear auth state and redirect to login.
      // We replicate what AuthProvider.logout() does to avoid a circular dep.
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);

      // Only redirect if not already on an auth page to prevent redirect loops.
      const pathname = window.location.pathname;
      const isAuthPage = pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER;
      if (!isAuthPage) {
        window.location.href = ROUTES.LOGIN;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
