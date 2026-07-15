/**
 * Role-to-dashboard route mapping.
 * Used by AuthProvider after login to redirect the user to the correct dashboard.
 */

import { ROUTES } from "@/constants/routes";
import type { Role } from "@/constants/roles";

export const ROLE_DASHBOARD_MAP: Record<Role, string> = {
  CUSTOMER: ROUTES.DASHBOARD,
  PROVIDER: ROUTES.PROVIDER.DASHBOARD,
  ADMIN: ROUTES.ADMIN.DASHBOARD,
} as const;

/** Duration (ms) to show the success toast before redirecting after register */
export const REGISTER_REDIRECT_DELAY_MS = 2000;
