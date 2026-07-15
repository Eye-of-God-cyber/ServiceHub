/**
 * Navbar — top navigation bar placeholder.
 *
 * Rendered at the top of every page inside the AppShell.
 * Responsibilities (future milestones):
 *   • ServiceHub logo / brand link
 *   • Primary navigation links (Catalog, Bookings, etc.)
 *   • Auth controls (Login / Register buttons  OR  user avatar dropdown)
 *   • Mobile hamburger that opens the Sidebar sheet
 *   • Notification bell badge
 *
 * Note: This Shadcn/ui version (base-ui) does not expose `asChild`.
 * Navigation links that look like buttons are styled with `buttonVariants`
 * applied directly to the <Link> element.
 */

import Link from "next/link";
import { Menu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
        >
          <span className="text-primary">Service</span>
          <span>Hub</span>
        </Link>

        {/* Desktop nav links — placeholder */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href={ROUTES.CATALOG}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Catalog
          </Link>
          <Link
            href={ROUTES.BOOKINGS}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Bookings
          </Link>
          <Link
            href={ROUTES.WALLET}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Wallet
          </Link>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Auth buttons — will be conditionally rendered by AuthProvider */}
          <Link
            href={ROUTES.LOGIN}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden md:inline-flex"
            )}
          >
            Log in
          </Link>
          <Link
            href={ROUTES.REGISTER}
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "hidden md:inline-flex"
            )}
          >
            Get started
          </Link>

          {/* Mobile hamburger — TODO: wire to Sidebar sheet in Milestone 1B */}
          <button
            type="button"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "md:hidden"
            )}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
