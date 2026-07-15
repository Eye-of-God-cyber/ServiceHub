/**
 * Backend API response types for the Catalog module.
 * These map exactly to what the backend returns.
 */

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiServiceListEntry {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  basePrice: string; // Decimal from DB is stringified in JSON
  estimatedDurationMin: number;
  isActive: boolean;
  category: {
    name: string;
  };
}

export interface ApiProviderUser {
  userProfile: {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  } | null;
}

export interface ApiProvider {
  id: number;
  bio: string | null;
  experienceYears: number;
  verificationStatus: string;
  avgRating: string; // Decimal
  totalReviews: number;
  user: ApiProviderUser;
}

export interface ApiProviderService {
  id: number;
  provider: ApiProvider;
}

export interface ApiServiceDetails {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  basePrice: string;
  estimatedDurationMin: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    name: string;
  };
  providerServices: ApiProviderService[];
}
