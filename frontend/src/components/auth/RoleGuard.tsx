"use client";

/**
 * RoleGuard — role-based authorization wrapper.
 *
 * Must be used INSIDE an AuthGuard so that the user is guaranteed to be
 * authenticated before the role check runs. Do not use RoleGuard alone.
 *
 * Behaviour:
 * ─────────────────────────────────────────────────────────────────────────────
 * • If the authenticated user's role IS in `allowedRoles` → renders children.
 * • If the authenticated user's role is NOT in `allowedRoles` → redirects the
 *   user to their own role's default dashboard (ROLE_DASHBOARD_MAP).
 *   This prevents:
 *     - A CUSTOMER accidentally visiting /provider/dashboard
 *     - A PROVIDER accessing /admin/dashboard
 *     - Infinite loops (redirect always points to the user's own route)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Usage:
 *   <AuthGuard>
 *     <RoleGuard allowedRoles={["CUSTOMER"]}>
 *       {children}
 *     </RoleGuard>
 *   </AuthGuard>
 */

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useIsClient } from "@/hooks/useIsClient";
import { ROLE_DASHBOARD_MAP } from "@/features/auth/constants/auth.constants";
import { AuthLoadingBoundary } from "./AuthLoadingBoundary";
import type { Role } from "@/constants/roles";

interface RoleGuardProps {
  children: React.ReactNode;
  /** Roles that are permitted to access the wrapped content */
  allowedRoles: Role[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const isClient = useIsClient();

  // Wait for hydration (same pattern as AuthGuard)
  if (!isClient) {
    return <AuthLoadingBoundary />;
  }

  // user is guaranteed non-null here because RoleGuard sits inside AuthGuard.
  // Type guard for safety.
  if (!user) {
    return <AuthLoadingBoundary label="Redirecting…" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to the user's own dashboard — never to a foreign role's route.
    const ownDashboard = ROLE_DASHBOARD_MAP[user.role];
    router.replace(ownDashboard);
    return <AuthLoadingBoundary label="Redirecting to your dashboard…" />;
  }

  return <>{children}</>;
}
