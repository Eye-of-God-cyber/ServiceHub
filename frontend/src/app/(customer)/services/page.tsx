"use client";

import { useState, useMemo } from "react";
import { SearchBar, CategoryFilter, ServiceCard, EmptyState, CatalogSkeleton } from "@/features/catalog/components";
import { useCategories, useServices } from "@/features/catalog/hooks";

/**
 * Service Catalog Page
 *
 * This page provides the primary service discovery experience for customers.
 * Uses live backend data.
 */
export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Fetch live data using React Query hooks
  const { data: categories = [], isLoading: isCategoriesLoading, isError: isCategoriesError } = useCategories();
  
  // We can fetch all services and filter locally, or pass categoryId if the backend supports it.
  // Given we have a search bar that filters across all services, fetching all and filtering locally
  // is often preferred for immediate responsiveness on small catalogs.
  const { data: services = [], isLoading: isServicesLoading, isError: isServicesError } = useServices();

  // Filter services based on search query and selected category
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      // Category filter
      if (selectedCategoryId && service.categoryId !== selectedCategoryId) {
        return false;
      }

      // Search query filter (matches title or description)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = service.title.toLowerCase().includes(query);
        const matchesDesc = service.description.toLowerCase().includes(query);
        
        if (!matchesTitle && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [services, searchQuery, selectedCategoryId]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategoryId(null);
  };

  // ── Error State ────────────────────────────────────────────────────────
  if (isCategoriesError || isServicesError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">Failed to load catalog</h2>
        <p className="text-muted-foreground mb-4">Please try refreshing the page.</p>
        <button onClick={() => window.location.reload()} className="text-primary hover:underline">
          Retry
        </button>
      </div>
    );
  }

  // ── Loading State ──────────────────────────────────────────────────────
  if (isCategoriesLoading || isServicesLoading) {
    return <CatalogSkeleton />;
  }

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-7xl mx-auto min-h-[calc(100vh-8rem)]">
      {/* ── Header & Search ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Browse Services
          </h1>
          <p className="text-muted-foreground mb-6">
            Find and book trusted professionals for all your home service needs.
          </p>
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Search by name or description..."
          />
        </div>
      </div>

      {/* ── Category Filter ────────────────────────────────────────────── */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm py-4 -mx-4 px-4 md:mx-0 md:px-0">
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
      </div>

      {/* ── Results Grid ───────────────────────────────────────────────── */}
      <div className="flex-1">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Showing <span className="text-foreground">{filteredServices.length}</span> services
          </p>
        </div>

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState onReset={handleResetFilters} />
          </div>
        )}
      </div>
    </div>
  );
}
