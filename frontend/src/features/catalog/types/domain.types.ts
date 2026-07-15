/**
 * Frontend Domain types for the Catalog module.
 * These represent the shape of data used directly by UI components.
 */

export interface Category {
  id: string; // Cast from number
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  serviceCount?: number;
}

export interface CatalogService {
  id: string; // Cast from number
  categoryId: string;
  categoryName: string;
  title: string; // Maps from name
  slug: string;
  description: string;
  startingPrice: number; // Parsed from string
  duration: string; // "X mins"
  rating: number; // Placeholder for now or pulled from provider aggregation
  reviewsCount: number; // Placeholder for now
  imageUrl: string;
}

export interface ServiceProvider {
  id: string; // Cast from number
  providerServiceId: string; // Cast from ApiProviderService.id
  name: string;
  experienceYears: number;
  rating: number; // Parsed from string
  totalJobs: number;
  startingPrice: number; // Inherited from service starting price
  isAvailable: boolean;
  isVerified: boolean;
  bio: string;
  avatarUrl: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface DetailedService extends CatalogService {
  tagline: string;
  included: string[];
  notIncluded: string[];
  highlights: string[];
  faqs: ServiceFAQ[];
  providers: ServiceProvider[];
  relatedServiceIds: string[];
}
