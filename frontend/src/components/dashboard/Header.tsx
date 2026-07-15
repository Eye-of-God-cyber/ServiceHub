"use client";

/**
 * Header — top navigation bar for the dashboard shell.
 *
 * Contains:
 *  • Hamburger menu for mobile (opens MobileSidebar)
 *  • Contextual page title / breadcrumbs (placeholder logic for now)
 *  • Notifications toggle (placeholder)
 *  • UserMenu (logout)
 */

import { Menu, Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/providers/SidebarProvider";
import { UserMenu } from "./UserMenu";
import { Button } from "@/components/ui/button";

export function Header() {
  const { openMobile } = useSidebar();
  const pathname = usePathname();

  // Simple heuristic for the page title based on the URL path.
  // In a real app, this might come from a breadcrumb context or config.
  const getPageTitle = () => {
    if (pathname.includes("dashboard")) return "Dashboard";
    if (pathname.includes("bookings")) return "Bookings";
    if (pathname.includes("wallet")) return "Wallet";
    if (pathname.includes("jobs")) return "Jobs";
    if (pathname.includes("profile")) return "Profile";
    if (pathname.includes("admin/users")) return "Users";
    return "Overview";
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full shrink-0 items-center justify-between border-b bg-background px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger — hidden on desktop */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden shrink-0 -ml-2"
          onClick={openMobile}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Page Title */}
        <div className="flex items-center">
          <h1 className="text-lg font-semibold tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications (Placeholder) */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* User Profile Menu */}
        <UserMenu />
      </div>
    </header>
  );
}
