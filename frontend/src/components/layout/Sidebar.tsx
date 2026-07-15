/**
 * Sidebar — left-hand navigation panel for authenticated dashboards.
 *
 * On desktop: rendered as a persistent aside column (w-64).
 * On mobile / tablet: hidden by default; opened as a Sheet from the Navbar
 *   hamburger button (wired in a later milestone).
 *
 * Future milestones will:
 *   • Show different nav items per role (CUSTOMER / PROVIDER / ADMIN)
 *   • Highlight the active route using usePathname()
 *   • Animate open/close via the Sheet component on small screens
 */

import Link from "next/link";
import {
  CalendarDays,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Star,
  Wallet,
  Bell,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const customerNavItems: NavItem[] = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Bookings", href: ROUTES.BOOKINGS, icon: CalendarDays },
  { label: "Wallet", href: ROUTES.WALLET, icon: Wallet },
  { label: "Reviews", href: ROUTES.REVIEWS, icon: Star },
  { label: "Disputes", href: ROUTES.DISPUTES, icon: MessageSquare },
  { label: "Notifications", href: ROUTES.NOTIFICATIONS, icon: Bell },
  { label: "Profile", href: ROUTES.PROFILE, icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex h-full w-64 flex-col border-r bg-background px-4 py-6">
      {/* Section heading */}
      <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        My Account
      </p>

      <nav className="flex flex-col gap-1">
        {customerNavItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <Separator className="my-4" />

      {/* Role-specific sections added in later milestones */}
      <p className="px-2 text-xs text-muted-foreground">
        {/* TODO: Provider / Admin links rendered conditionally by role */}
      </p>
    </aside>
  );
}
