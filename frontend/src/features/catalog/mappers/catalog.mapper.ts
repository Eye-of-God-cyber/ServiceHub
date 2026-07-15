import type { ApiCategory, ApiServiceListEntry, ApiServiceDetails, ApiProviderService } from "../types/api.types";
import type { Category, CatalogService, DetailedService, ServiceProvider } from "../types/domain.types";
import { CATALOG_SERVICES } from "@/features/catalog/mock/catalogData";
import { MOCK_DETAILED_SERVICES } from "@/features/service-details/mock/serviceDetailsData";

/**
 * Maps an ApiCategory to a frontend Category domain model.
 */
export function mapCategoryToDomain(apiCategory: ApiCategory): Category {
  return {
    id: apiCategory.id.toString(),
    name: apiCategory.name,
    slug: apiCategory.slug,
    description: apiCategory.description || "",
    imageUrl: apiCategory.imageUrl || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop", // Fallback if no image
    serviceCount: undefined,
  };
}

/**
 * Maps an ApiServiceListEntry to a frontend CatalogService domain model.
 */
export function mapServiceToDomain(apiService: ApiServiceListEntry): CatalogService {
  // Find mock presentation data if it exists, otherwise use fallbacks
  const mockPres = CATALOG_SERVICES.find((s) => s.id === apiService.id.toString());
  
  return {
    id: apiService.id.toString(),
    categoryId: apiService.categoryId.toString(),
    categoryName: apiService.category.name,
    title: apiService.name,
    slug: apiService.slug,
    description: apiService.description,
    startingPrice: parseFloat(apiService.basePrice) || 0,
    duration: `${apiService.estimatedDurationMin} mins`,
    // Presentation-only metadata from mock or fallback
    rating: mockPres?.rating || 4.5,
    reviewsCount: mockPres?.reviewsCount || 0,
    imageUrl: mockPres?.imageUrl || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop",
  };
}

/**
 * Maps an ApiProviderService to a frontend ServiceProvider domain model.
 */
export function mapProviderToDomain(apiProviderService: ApiProviderService, basePrice: number): ServiceProvider {
  const provider = apiProviderService.provider;
  const user = provider.user.userProfile;
  
  return {
    id: provider.id.toString(),
    providerServiceId: apiProviderService.id.toString(),
    name: user ? `${user.firstName} ${user.lastName}` : "Unknown Provider",
    experienceYears: provider.experienceYears,
    rating: parseFloat(provider.avgRating) || 0,
    totalJobs: provider.totalReviews || 0, // Using reviews as proxy for jobs if jobs not available
    startingPrice: basePrice,
    isAvailable: true, // Only available ones are included by the backend
    isVerified: provider.verificationStatus === 'APPROVED',
    bio: provider.bio || "Professional service provider.",
    avatarUrl: user?.avatarUrl || `https://i.pravatar.cc/150?u=${provider.id}`,
  };
}

/**
 * Maps an ApiServiceDetails to a frontend DetailedService domain model.
 * Merges presentation-only metadata from mock definitions.
 */
export function mapServiceDetailsToDomain(apiService: ApiServiceDetails): DetailedService {
  const baseService = mapServiceToDomain(apiService);
  
  // Lookup presentation-only metadata
  const mockDetails = MOCK_DETAILED_SERVICES[baseService.id] || MOCK_DETAILED_SERVICES["default"];
  
  return {
    ...baseService,
    tagline: mockDetails.tagline || "Professional and reliable service.",
    included: mockDetails.included || ["Standard tools and equipment", "Professional service delivery"],
    notIncluded: mockDetails.notIncluded || ["Specialized parts", "Major structural work"],
    highlights: mockDetails.highlights || ["Vetted professionals", "Satisfaction guaranteed"],
    faqs: mockDetails.faqs || [],
    providers: apiService.providerServices.map(ps => mapProviderToDomain(ps, baseService.startingPrice)),
    relatedServiceIds: mockDetails.relatedServiceIds || [],
  };
}
