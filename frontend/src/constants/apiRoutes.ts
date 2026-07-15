/**
 * Centralized map of all ServiceHub backend API route paths.
 * These are path segments only — the base URL is set in the Axios client.
 * Usage: api.get(API_ROUTES.AUTH.ME)
 */

export const API_ROUTES = {
  // ── Authentication ────────────────────────────────────────────
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    ME: "/auth/me",
  },

  // ── User Profile & Addresses ───────────────────────────────────
  USERS: {
    PROFILE: "/users/profile",
    ADDRESSES: "/users/addresses",
    ADDRESS_BY_ID: (id: number) => `/users/addresses/${id}`,
    ADDRESS_DEFAULT: (id: number) => `/users/addresses/${id}/default`,
  },

  // ── Provider ──────────────────────────────────────────────────
  PROVIDERS: {
    ME: "/providers/me",
    DOCUMENTS: "/providers/documents",
    DOCUMENT_BY_ID: (id: number) => `/providers/documents/${id}`,
    AVAILABILITY: "/providers/availability",
    TIME_OFF: "/providers/time-off",
    TIME_OFF_BY_ID: (id: number) => `/providers/time-off/${id}`,
    SERVICES: "/providers/services",
    SERVICE_BY_ID: (id: number) => `/providers/services/${id}`,
  },

  // ── Catalog (public) ──────────────────────────────────────────
  CATALOG: {
    CATEGORIES: "/catalog/categories",
    SERVICES: "/catalog/services",
    SERVICE_BY_ID: (id: number) => `/catalog/services/${id}`,
  },

  // ── Bookings ─────────────────────────────────────────────────
  BOOKINGS: {
    LIST: "/bookings",
    CREATE: "/bookings",
    BY_ID: (id: number) => `/bookings/${id}`,
    STATUS: (id: number) => `/bookings/${id}/status`,
  },

  // ── Wallets ───────────────────────────────────────────────────
  WALLETS: {
    ME: "/wallets/me",
  },

  // ── Reviews ───────────────────────────────────────────────────
  REVIEWS: {
    LIST: "/reviews",
    CREATE: "/reviews",
    REPLY: (reviewId: number) => `/reviews/${reviewId}/reply`,
  },

  // ── Notifications ─────────────────────────────────────────────
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: (id: number) => `/notifications/${id}/read`,
    READ_ALL: "/notifications/read-all",
  },

  // ── Disputes ──────────────────────────────────────────────────
  DISPUTES: {
    LIST: "/disputes",
    CREATE: "/disputes",
    BY_ID: (id: number) => `/disputes/${id}`,
    MESSAGES: (id: number) => `/disputes/${id}/messages`,
  },

  // ── Admin ─────────────────────────────────────────────────────
  ADMIN: {
    DOCUMENT_STATUS: (docId: number) => `/admin/documents/${docId}/status`,
    RESOLVE_DISPUTE: (disputeId: number) =>
      `/admin/disputes/${disputeId}/resolve`,
  },

  // ── Health ────────────────────────────────────────────────────
  HEALTH: "/health",
} as const;
