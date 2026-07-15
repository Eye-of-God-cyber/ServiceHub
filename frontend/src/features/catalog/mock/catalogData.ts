import { ROUTES } from "@/constants/routes";

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface CatalogService {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  startingPrice: number;
  duration: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  href: string;
}

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  { id: "plumbing", name: "Plumbing", slug: "plumbing" },
  { id: "electrical", name: "Electrical", slug: "electrical" },
  { id: "cleaning", name: "Cleaning", slug: "cleaning" },
  { id: "ac-repair", name: "AC Repair", slug: "ac-repair" },
  { id: "salon", name: "Salon at Home", slug: "salon" },
  { id: "painting", name: "Painting", slug: "painting" },
  { id: "pest-control", name: "Pest Control", slug: "pest-control" },
];

export const CATALOG_SERVICES: CatalogService[] = [
  {
    id: "srv_1",
    title: "Deep Home Cleaning",
    description: "Thorough deep cleaning of your entire home including hard-to-reach areas.",
    categoryId: "cleaning",
    categoryName: "Cleaning",
    startingPrice: 149.99,
    duration: "3-4 hours",
    rating: 4.8,
    reviewsCount: 124,
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
    href: ROUTES.SERVICE_DETAIL("srv_1"),
  },
  {
    id: "srv_2",
    title: "AC Servicing & Maintenance",
    description: "Comprehensive AC servicing including filter cleaning and gas check.",
    categoryId: "ac-repair",
    categoryName: "AC Repair",
    startingPrice: 79.99,
    duration: "1 hour",
    rating: 4.9,
    reviewsCount: 312,
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop",
    href: ROUTES.SERVICE_DETAIL("srv_2"),
  },
  {
    id: "srv_3",
    title: "Professional Plumbing Inspection",
    description: "Expert inspection for leaks, blockages, and pipe maintenance.",
    categoryId: "plumbing",
    categoryName: "Plumbing",
    startingPrice: 49.99,
    duration: "45 mins",
    rating: 4.7,
    reviewsCount: 89,
    imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600&auto=format&fit=crop",
    href: ROUTES.SERVICE_DETAIL("srv_3"),
  },
  {
    id: "srv_4",
    title: "Whole House Painting",
    description: "Premium interior and exterior painting services with high-quality paint.",
    categoryId: "painting",
    categoryName: "Painting",
    startingPrice: 999.0,
    duration: "2-3 days",
    rating: 4.9,
    reviewsCount: 56,
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop",
    href: ROUTES.SERVICE_DETAIL("srv_4"),
  },
  {
    id: "srv_5",
    title: "Electrical Fault Repair",
    description: "Quick and safe repair of short circuits, wiring issues, and faulty outlets.",
    categoryId: "electrical",
    categoryName: "Electrical",
    startingPrice: 65.0,
    duration: "1-2 hours",
    rating: 4.6,
    reviewsCount: 42,
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop", // placeholder
    href: ROUTES.SERVICE_DETAIL("srv_5"),
  },
  {
    id: "srv_6",
    title: "Pest Extermination",
    description: "Complete elimination of ants, cockroaches, and termites.",
    categoryId: "pest-control",
    categoryName: "Pest Control",
    startingPrice: 120.0,
    duration: "2 hours",
    rating: 4.8,
    reviewsCount: 156,
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop", // placeholder
    href: ROUTES.SERVICE_DETAIL("srv_6"),
  },
];
