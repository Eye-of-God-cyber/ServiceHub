import {
  Droplets,
  Zap,
  Sparkles,
  Wind,
  Scissors,
  Paintbrush,
  Bug,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export const MOCK_CATEGORIES: ServiceCategory[] = [
  {
    id: "plumbing",
    name: "Plumbing",
    description: "Pipes, leaks, and fixtures",
    icon: Droplets,
    href: ROUTES.CATALOG_CATEGORY("plumbing"),
  },
  {
    id: "electrical",
    name: "Electrical",
    description: "Wiring, repairs, and installations",
    icon: Zap,
    href: ROUTES.CATALOG_CATEGORY("electrical"),
  },
  {
    id: "cleaning",
    name: "Cleaning",
    description: "Deep clean and regular housekeeping",
    icon: Sparkles,
    href: ROUTES.CATALOG_CATEGORY("cleaning"),
  },
  {
    id: "ac-repair",
    name: "AC Repair",
    description: "Maintenance and fixing cooling systems",
    icon: Wind,
    href: ROUTES.CATALOG_CATEGORY("ac-repair"),
  },
  {
    id: "salon",
    name: "Salon at Home",
    description: "Haircuts, styling, and grooming",
    icon: Scissors,
    href: ROUTES.CATALOG_CATEGORY("salon"),
  },
  {
    id: "painting",
    name: "Painting",
    description: "Interior and exterior wall painting",
    icon: Paintbrush,
    href: ROUTES.CATALOG_CATEGORY("painting"),
  },
  {
    id: "pest-control",
    name: "Pest Control",
    description: "Extermination and prevention",
    icon: Bug,
    href: ROUTES.CATALOG_CATEGORY("pest-control"),
  },
  {
    id: "appliance-repair",
    name: "Appliance Repair",
    description: "Fixing washing machines, fridges, etc.",
    icon: Wrench,
    href: ROUTES.CATALOG_CATEGORY("appliance-repair"),
  },
];
