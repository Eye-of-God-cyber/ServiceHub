import { ROUTES } from "@/constants/routes";

export interface FeaturedService {
  id: string;
  title: string;
  category: string;
  startingPrice: number;
  duration: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  href: string;
}

export const MOCK_FEATURED_SERVICES: FeaturedService[] = [
  {
    id: "srv_1",
    title: "Deep Home Cleaning",
    category: "Cleaning",
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
    category: "AC Repair",
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
    category: "Plumbing",
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
    category: "Painting",
    startingPrice: 999.0,
    duration: "2-3 days",
    rating: 4.9,
    reviewsCount: 56,
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop",
    href: ROUTES.SERVICE_DETAIL("srv_4"),
  },
];
