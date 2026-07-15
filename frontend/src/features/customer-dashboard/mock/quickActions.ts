import { Search, Calendar, Heart, Wallet, type LucideIcon } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  colorClass: string;
}

export const MOCK_QUICK_ACTIONS: QuickAction[] = [
  {
    id: "browse",
    title: "Browse Services",
    description: "Find the right professional for your needs",
    icon: Search,
    href: ROUTES.SERVICES,
    colorClass: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  },
  {
    id: "bookings",
    title: "My Bookings",
    description: "Track your upcoming and past services",
    icon: Calendar,
    href: ROUTES.BOOKINGS,
    colorClass: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  },
  {
    id: "saved",
    title: "Saved Providers",
    description: "View your favorite service professionals",
    icon: Heart,
    href: ROUTES.DASHBOARD, // Placeholder
    colorClass: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
  },
  {
    id: "wallet",
    title: "Wallet & Promos",
    description: "Check your balance and active coupons",
    icon: Wallet,
    href: ROUTES.WALLET,
    colorClass: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  },
];
