/**
 * Role names that mirror the backend RoleName enum.
 * Use these constants everywhere instead of raw strings so a
 * rename in the future only needs one touch-point.
 */

export const ROLES = {
  CUSTOMER: "CUSTOMER",
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN",
} as const;

/** Union type of all valid role strings */
export type Role = (typeof ROLES)[keyof typeof ROLES];
