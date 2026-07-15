"use client";

import { useAuth } from "@/providers/AuthProvider";
import { ROUTES } from "@/constants/routes";
import { 
  HeroBanner, 
  SectionHeader, 
  ServiceCategoryCard, 
  FeaturedServiceCard, 
  QuickActionCard 
} from "@/features/customer-dashboard/components";
import { MOCK_CATEGORIES } from "@/features/customer-dashboard/mock/categories";
import { MOCK_FEATURED_SERVICES } from "@/features/customer-dashboard/mock/services";
import { MOCK_QUICK_ACTIONS } from "@/features/customer-dashboard/mock/quickActions";

/**
 * Customer Dashboard Home
 *
 * This is the entry point for authenticated customers. It uses presentational
 * components and mock data to establish the UI structure without making
 * any real backend calls yet.
 */
export default function CustomerDashboardPage() {
  const { user } = useAuth();
  
  // Extract name from email for greeting, fallback to "there"
  const firstName = user?.email?.split("@")[0] || "there";

  return (
    <div className="flex flex-col gap-10 pb-10 max-w-7xl mx-auto">
      {/* ── 1. Hero / Welcome Section ──────────────────────────────────── */}
      <section>
        <HeroBanner
          greeting={`Welcome back, ${firstName}`}
          headline="What do you need help with today?"
          subheadline="Book trusted professionals for cleaning, repairs, and maintenance. Get it done right, the first time."
          primaryAction={{ label: "Browse Services" }}
          secondaryAction={{ label: "View Offers" }}
        />
      </section>

      {/* ── 2. Quick Actions ───────────────────────────────────────────── */}
      <section>
        <SectionHeader title="Quick Actions" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_QUICK_ACTIONS.map((action) => (
            <QuickActionCard key={action.id} action={action} />
          ))}
        </div>
      </section>

      {/* ── 3. Categories ──────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="Service Categories"
          description="Find the right expert for every job"
          viewAllHref={ROUTES.SERVICES}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          {MOCK_CATEGORIES.map((category) => (
            <ServiceCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* ── 4. Featured Services ───────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="Featured & Trending"
          description="Highly rated services near you"
          viewAllHref={ROUTES.SERVICES}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_FEATURED_SERVICES.map((service) => (
            <FeaturedServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>
    </div>
  );
}
