/**
 * AppShell — the root layout shell for all pages.
 *
 * Responsive layout strategy:
 * ─────────────────────────────────────────────────────────────────────────────
 * Mobile  (< md):  Navbar (sticky top) → full-width main → Footer
 *                  Sidebar is hidden; navigation is accessed via the hamburger
 *                  sheet opened from the Navbar.
 *
 * Tablet  (md):    Same as mobile but Sidebar starts to appear as a narrow
 *                  left rail (handled by Sidebar's own responsive classes).
 *
 * Desktop (lg+):   Sidebar (w-64, fixed height) | main (flex-1, scrollable)
 *                  stacked inside a flex row, all below the sticky Navbar.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * The `showSidebar` prop lets pages that don't need a sidebar (e.g. landing,
 * catalog, auth pages) opt out without changing the Navbar / Footer.
 */

import React from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

interface AppShellProps {
  children: React.ReactNode;
  /** Pass false for public pages that don't need the sidebar */
  showSidebar?: boolean;
}

export function AppShell({ children, showSidebar = false }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Sticky top navigation ─────────────────────────────── */}
      <Navbar />

      {/* ── Content area (sidebar + main) ───────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && <Sidebar />}

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
