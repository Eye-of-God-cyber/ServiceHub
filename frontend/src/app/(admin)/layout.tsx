"use client";

/**
 * Admin route group layout.
 *
 * Applies to all routes under (admin)/ — i.e. /admin/dashboard,
 * /admin/documents, /admin/disputes, /admin/users.
 *
 * Guards:
 *  1. AuthGuard  — redirects unauthenticated users to /login
 *  2. RoleGuard  — redirects non-ADMIN users to their own dashboard
 *
 * Shell:
 *  • DashboardLayout — renders the responsive sidebar and header using the
 *    admin navigation configuration.
 */

import React from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { ROLES } from "@/constants/roles";
import { DashboardLayout } from "@/components";
import { adminNavConfig } from "@/constants/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={[ROLES.ADMIN]}>
        <DashboardLayout navConfig={adminNavConfig}>
          {children}
        </DashboardLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
