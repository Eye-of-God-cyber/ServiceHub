/**
 * Navigation configuration for the dashboard shell.
 *
 * Each role has its own ordered list of NavConfig items.
 * The Sidebar component iterates this array — zero JSX hardcoding.
 *
 * To add a new nav item: add an entry here; the sidebar renders it automatically.
 */

import {
  LayoutDashboard,
  Calendar,
  Wallet,
  Star,
  AlertTriangle,
  Bell,
  User,
  MapPin,
  Search,
  Briefcase,
  Ticket,
  FileText,
  Wrench,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "./routes";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Optional badge count (future use — notification counts, pending items) */
  badge?: string | number;
}

export interface NavGroup {
  /** Optional section heading displayed above the group */
  title?: string;
  items: NavItem[];
}

export type NavConfig = NavGroup[];

// ── Customer Navigation ───────────────────────────────────────────────────────
export const customerNavConfig: NavConfig = [
  {
    items: [
      { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
      { label: "Browse Services", href: ROUTES.SERVICES, icon: Search },
      { label: "My Bookings", href: ROUTES.BOOKINGS, icon: Calendar },
      { label: "My Wallet", href: ROUTES.WALLET, icon: Wallet },
    ],
  },
  {
    title: "Activity",
    items: [
      { label: "Reviews", href: ROUTES.REVIEWS, icon: Star },
      { label: "Disputes", href: ROUTES.DISPUTES, icon: AlertTriangle },
      { label: "Notifications", href: ROUTES.NOTIFICATIONS, icon: Bell },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", href: ROUTES.PROFILE, icon: User },
      { label: "Addresses", href: ROUTES.ADDRESSES, icon: MapPin },
    ],
  },
];

// ── Provider Navigation ───────────────────────────────────────────────────────
export const providerNavConfig: NavConfig = [
  {
    items: [
      {
        label: "Dashboard",
        href: ROUTES.PROVIDER.DASHBOARD,
        icon: LayoutDashboard,
      },
      { 
        label: "Bookings", 
        href: ROUTES.PROVIDER.BOOKINGS, 
        icon: Calendar 
      },
      {
        label: "Services",
        href: ROUTES.PROVIDER.SERVICES,
        icon: Wrench,
      },
      { 
        label: "Profile", 
        href: ROUTES.PROVIDER.PROFILE, 
        icon: User 
      },
    ],
  },
];

// ── Admin Navigation ──────────────────────────────────────────────────────────
export const adminNavConfig: NavConfig = [
  {
    items: [
      {
        label: "Dashboard",
        href: ROUTES.ADMIN.DASHBOARD,
        icon: LayoutDashboard,
      },
      {
        label: "Users",
        href: ROUTES.ADMIN.USERS,
        icon: Users,
      },
      {
        label: "Providers",
        href: ROUTES.ADMIN.PROVIDERS,
        icon: Briefcase,
      },
      {
        label: "Bookings",
        href: ROUTES.ADMIN.BOOKINGS,
        icon: Calendar,
      },
      {
        label: "Coupons",
        href: ROUTES.ADMIN.COUPONS,
        icon: Ticket,
      },
      {
        label: "Disputes",
        href: ROUTES.ADMIN.DISPUTES,
        icon: AlertTriangle,
      },
      {
        label: "Reports",
        href: ROUTES.ADMIN.REPORTS,
        icon: FileText,
      }
    ],
  },
];

// ── Role → Config map ─────────────────────────────────────────────────────────
import type { Role } from "./roles";

export const NAV_CONFIG_BY_ROLE: Record<Role, NavConfig> = {
  CUSTOMER: customerNavConfig,
  PROVIDER: providerNavConfig,
  ADMIN: adminNavConfig,
};
