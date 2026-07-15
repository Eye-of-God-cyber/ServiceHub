/**
 * Footer — site-wide footer placeholder.
 *
 * Rendered at the bottom of the AppShell.
 * Future milestones will add:
 *   • Links (About, Terms, Privacy, Contact)
 *   • Social icons
 *   • Newsletter signup
 */

import Link from "next/link";
import { ROUTES } from "@/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        {/* Brand */}
        <p className="font-semibold">
          <span className="text-primary">Service</span>Hub
        </p>

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-4">
          <Link href={ROUTES.HOME} className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href={ROUTES.CATALOG} className="hover:text-foreground transition-colors">
            Catalog
          </Link>
          {/* TODO: add About, Terms, Privacy pages */}
        </nav>

        {/* Copyright */}
        <p>© {currentYear} ServiceHub. All rights reserved.</p>
      </div>
    </footer>
  );
}
