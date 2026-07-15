"use client";

/**
 * Provider route group layout.
 *
 * Applies to all routes under (provider)/ — i.e. /provider, /provider/bookings,
 * /provider/services, /provider/profile.
 *
 * Guards:
 *  1. AuthGuard  — redirects unauthenticated users to /login
 *  2. RoleGuard  — redirects non-PROVIDER users to their own dashboard
 *
 * Shell:
 *  • DashboardLayout — renders the responsive sidebar and header using the
 *    provider navigation configuration.
 */

import React from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { ROLES } from "@/constants/roles";
import { DashboardLayout } from "@/components";
import { providerNavConfig } from "@/constants/navigation";

interface ProviderLayoutProps {
  children: React.ReactNode;
}

export default function ProviderLayout({ children }: ProviderLayoutProps) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[ROLES.PROVIDER]}>
        <DashboardLayout navConfig={providerNavConfig}>
          {children}
        </DashboardLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
