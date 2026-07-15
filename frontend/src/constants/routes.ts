/**
 * All frontend page routes in one place.
 * Use these instead of hard-coded strings in <Link href="..."> or router.push().
 */

export const ROUTES = {
  // ── Public ─────────────────────────────────────────────────────
  HOME: "/",
  CATALOG: "/catalog",
  CATALOG_CATEGORY: (slug: string) => `/catalog/${slug}`,
  SERVICE_DETAIL: (id: number | string) => `/services/${id}`,

  // ── Auth ───────────────────────────────────────────────────────
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  // ── Customer Dashboard ─────────────────────────────────────────
  DASHBOARD: "/dashboard",
  SERVICES: "/services",
  BOOKINGS: "/bookings",
  BOOKING_DETAIL: (id: number | string) => `/bookings/${id}`,
  BOOKING_FLOW: (serviceId: number | string, providerServiceId: number | string) => `/services/${serviceId}/book/${providerServiceId}`,
  WALLET: "/wallet",
  REVIEWS: "/reviews",
  DISPUTES: "/dashboard/disputes",
  DISPUTE_DETAIL: (id: number | string) => `/dashboard/disputes/${id}`,
  NOTIFICATIONS: "/dashboard/notifications",
  PROFILE: "/profile",
  ADDRESSES: "/profile/addresses",

  // ── Provider Dashboard ─────────────────────────────────────────
  PROVIDER: {
    DASHBOARD: "/provider",
    BOOKINGS: "/provider/bookings",
    SERVICES: "/provider/services",
    PROFILE: "/provider/profile",
  },

  // ── Admin Dashboard ────────────────────────────────────────────
  ADMIN: {
    DASHBOARD: "/admin",
    USERS: "/admin/users",
    PROVIDERS: "/admin/providers",
    BOOKINGS: "/admin/bookings",
    COUPONS: "/admin/coupons",
    DISPUTES: "/admin/disputes",
    REPORTS: "/admin/reports",
  },
} as const;
