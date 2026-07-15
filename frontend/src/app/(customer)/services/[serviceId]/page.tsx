"use client";

import { use, useMemo } from "react";
import { isApiNotFoundError } from "@/utils/parseApiError";
import { notFound, useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useServiceDetails, useServices } from "@/features/catalog/hooks";
import {
  Breadcrumb,
  ServiceHeader,
  ServiceOverview,
  ProviderList,
  FAQAccordion,
  RelatedServicesSection,
  ServiceDetailsSkeleton,
  type BreadcrumbSegment,
} from "@/features/service-details/components";

/**
 * Service Details & Provider Listing Page
 *
 * Displays comprehensive details of a selected service and available professionals
 * using live backend data.
 */
export default function ServiceDetailsPage({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = use(params);
  const router = useRouter();

  // Fetch live service details
  const { data: detailedService, isLoading, isError, error } = useServiceDetails(serviceId);
  
  // Fetch all services to find related services
  const { data: allServices = [] } = useServices();

  // Find the actual related services from the catalog data
  const relatedServices = useMemo(() => {
    if (!detailedService) return [];
    return detailedService.relatedServiceIds
      .map(id => allServices.find(s => s.id === id))
      .filter((s): s is NonNullable<typeof s> => s !== undefined);
  }, [detailedService, allServices]);

  // ── Error State ────────────────────────────────────────────────────────
  if (isError) {
    const isNotFound = isApiNotFoundError(error);
    
    if (isNotFound) {
      notFound();
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">Failed to load service details</h2>
        <p className="text-muted-foreground mb-4">Please try refreshing the page or go back to the catalog.</p>
        <div className="flex gap-4 mt-4">
          <button onClick={() => window.location.reload()} className="text-primary hover:underline">
            Retry
          </button>
          <button onClick={() => router.push(ROUTES.SERVICES)} className="text-muted-foreground hover:underline">
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  // ── Loading State ──────────────────────────────────────────────────────
  if (isLoading || !detailedService) {
    return <ServiceDetailsSkeleton />;
  }

  // Define breadcrumb path
  const breadcrumbSegments: BreadcrumbSegment[] = [
    { label: "Dashboard", href: ROUTES.DASHBOARD },
    { label: "Services", href: ROUTES.SERVICES },
    { label: detailedService.title },
  ];

  return (
    <div className="flex flex-col gap-10 pb-16 max-w-7xl mx-auto min-h-[calc(100vh-8rem)]">
      
      {/* ── 1. Breadcrumbs ─────────────────────────────────────────────── */}
      <div className="px-4 md:px-0 pt-2">
        <Breadcrumb segments={breadcrumbSegments} />
      </div>

      {/* ── 2. Service Header ──────────────────────────────────────────── */}
      <section className="px-4 md:px-0">
        <ServiceHeader
          title={detailedService.title}
          categoryName={detailedService.categoryName}
          rating={detailedService.rating}
          reviewsCount={detailedService.reviewsCount}
          startingPrice={detailedService.startingPrice}
          duration={detailedService.duration}
          tagline={detailedService.tagline}
          imageUrl={detailedService.imageUrl}
        />
      </section>

      <div className="grid lg:grid-cols-3 gap-10 px-4 md:px-0">
        {/* ── Left Column (Overview & FAQs) ────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          
          {/* 3. Service Overview */}
          <section>
            <ServiceOverview
              description={detailedService.description}
              included={detailedService.included}
              notIncluded={detailedService.notIncluded}
              highlights={detailedService.highlights}
            />
          </section>

          {/* 5. FAQ Section */}
          <section>
            <FAQAccordion faqs={detailedService.faqs} />
          </section>

        </div>

        {/* ── Right Column (Available Providers) ───────────────────────── */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <h3 className="text-xl font-bold tracking-tight mb-6">
              Available Professionals
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Select a professional to view their full profile and book this service.
            </p>
            {/* 4. Available Providers */}
            <ProviderList providers={detailedService.providers} serviceId={serviceId} />
          </div>
        </div>
      </div>

      {/* ── 6. Related Services ────────────────────────────────────────── */}
      {relatedServices.length > 0 && (
        <section className="px-4 md:px-0 mt-10 border-t pt-10">
          <RelatedServicesSection services={relatedServices} />
        </section>
      )}

    </div>
  );
}
