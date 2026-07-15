"use client";

/**
 * DashboardLayout — the core shell for all authenticated areas.
 *
 * Architecture:
 * ─────────────────────────────────────────────────────────────────────────────
 * • Wraps its children in SidebarProvider so Sidebar and Header can coordinate
 *   collapse and mobile-drawer states without prop drilling.
 * • Renders MobileSidebar (for <md screens) and Sidebar (for >=md screens).
 * • Renders the top Header.
 * • Dynamically adjusts the main content's left margin based on the sidebar's
 *   collapsed state (w-16 vs w-64).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from "react";
import { SidebarProvider, useSidebar } from "@/providers/SidebarProvider";
import { Sidebar } from "./Sidebar";
import { MobileSidebar } from "./MobileSidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
import type { NavConfig } from "@/constants/navigation";

interface DashboardLayoutInnerProps {
  children: React.ReactNode;
  navConfig: NavConfig;
  brandName?: string;
}

// Inner component that actually consumes the SidebarContext
function DashboardLayoutInner({ children, navConfig, brandName }: DashboardLayoutInnerProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="relative min-h-screen bg-background">
      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <Sidebar navConfig={navConfig} brandName={brandName} />
      <MobileSidebar navConfig={navConfig} brandName={brandName} />

      {/* ── Main Content Area ────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300 ease-in-out",
          // On mobile, sidebar is off-canvas so no left margin.
          // On desktop, push content right by the width of the sidebar.
          "md:ml-64",
          isCollapsed && "md:ml-16"
        )}
      >
        <Header />
        
        {/* Main page content container */}
        <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

// ── Exported Wrapper ──────────────────────────────────────────────────────────
export interface DashboardLayoutProps {
  children: React.ReactNode;
  navConfig: NavConfig;
  brandName?: string;
}

/**
 * Public wrapper that injects the SidebarProvider.
 */
export function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardLayoutInner {...props} />
    </SidebarProvider>
  );
}
