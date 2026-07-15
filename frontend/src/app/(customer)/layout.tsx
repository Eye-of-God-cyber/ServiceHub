"use client";

/**
 * Customer route group layout.
 *
 * Applies to all routes under (customer)/ — i.e. /dashboard, /bookings,
 * /wallet, /reviews, /disputes, /notifications, /profile, /addresses.
 *
 * Guards:
 *  1. AuthGuard  — redirects unauthenticated users to /login
 *  2. RoleGuard  — redirects non-CUSTOMER users to their own dashboard
 *
 * Shell:
 *  • DashboardLayout — renders the responsive sidebar and header using the
 *    customer navigation configuration.
 */

import React from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { ROLES } from "@/constants/roles";
import { DashboardLayout } from "@/components";
import { customerNavConfig } from "@/constants/navigation";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[ROLES.CUSTOMER]}>
        <DashboardLayout navConfig={customerNavConfig}>
          {children}
        </DashboardLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
