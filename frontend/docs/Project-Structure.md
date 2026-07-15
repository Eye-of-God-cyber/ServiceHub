# Project Structure — ServiceHub Frontend

This document describes every major folder and file in the project and explains its purpose.

---

## Root Layout

```
frontend/
├── src/                    # All application source code
├── public/                 # Static assets (icons, images)
├── docs/                   # Developer documentation (this file lives here)
├── .env.example            # Environment variable template
├── .env.local              # Local overrides (git-ignored)
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration (strict mode)
├── eslint.config.mjs       # ESLint configuration
├── postcss.config.mjs      # PostCSS (Tailwind CSS) configuration
├── components.json         # shadcn/ui component installation config
└── package.json            # Dependencies and npm scripts
```

---

## `src/app/` — Next.js App Router

The App Router is organized with **route groups** (folders wrapped in parentheses) that share a layout but do not appear in the URL.

```
src/app/
├── layout.tsx              # Root layout — mounts all providers (Auth, Query, Theme, Sidebar)
├── page.tsx                # Landing page (public)
├── globals.css             # CSS custom properties, Tailwind base styles
│
├── (auth)/                 # Auth route group — no sidebar, no header
│   ├── login/page.tsx      # Login page
│   └── register/page.tsx   # Registration page
│
├── (customer)/             # Customer route group — authenticated CUSTOMER role
│   ├── layout.tsx          # Customer layout: sidebar + AuthGuard + RoleGuard
│   ├── dashboard/page.tsx  # Customer home dashboard
│   ├── services/
│   │   ├── page.tsx                        # Service catalog listing
│   │   └── [serviceId]/
│   │       ├── page.tsx                    # Service detail & provider listing
│   │       └── book/[providerServiceId]/   # Booking creation flow
│   ├── bookings/
│   │   ├── page.tsx                        # Bookings list
│   │   └── [bookingId]/page.tsx            # Booking detail
│   ├── wallet/page.tsx     # Wallet & transaction history
│   ├── reviews/page.tsx    # Review submission & listing
│   └── profile/
│       ├── page.tsx        # User profile editor
│       └── addresses/page.tsx  # Address management
│
├── (provider)/             # Provider route group — authenticated PROVIDER role
│   ├── layout.tsx          # Provider layout: sidebar + AuthGuard + RoleGuard
│   └── provider/
│       ├── page.tsx        # Provider home dashboard
│       ├── bookings/page.tsx   # Incoming bookings management
│       ├── profile/page.tsx    # Profile & documents management
│       └── services/page.tsx   # Services, availability & time-off management
│
└── (admin)/                # Admin route group — authenticated ADMIN role
    ├── layout.tsx          # Admin layout: sidebar + AuthGuard + RoleGuard
    └── admin/
        ├── page.tsx        # Admin dashboard
        ├── bookings/page.tsx   # All platform bookings
        └── disputes/page.tsx   # Dispute management
```

### Placeholder Admin Pages (UI Shell Only)

The following admin pages exist as route shells but have no backend-connected functionality:

| Route | Status |
|-------|--------|
| `/admin/users` | ⛔ Placeholder — no backend API |
| `/admin/providers` | ⛔ Placeholder — no backend API |
| `/admin/coupons` | ⛔ Placeholder — no backend API |
| `/admin/reports` | ⛔ Placeholder — no backend API |

---

## `src/features/` — Feature Modules

This is the core of the application. Each subfolder is a completely self-contained feature domain. Features never import from each other's internal layers — they may only import shared domain types from `src/shared/`.

```
src/features/
├── index.ts                # Barrel export for all features

├── auth/                   # Authentication feature
│   ├── components/         # LoginForm, RegisterForm
│   ├── forms/              # Form field components
│   ├── hooks/              # useLogin, useRegister, useMe
│   ├── schema/             # Zod schemas for login/register forms
│   ├── types/              # ApiAuthResponse, AuthUser domain types
│   └── constants/          # Role constants specific to auth

├── booking/                # Customer booking feature
│   ├── components/         # BookingList, BookingCard, BookingStatusBadge, etc.
│   ├── hooks/              # useBookings, useBookingDetails, useCreateBooking, useCancelBooking
│   ├── mappers/            # booking.mapper.ts — maps API DTOs to domain Booking models
│   ├── services/           # booking.service.ts — calls /bookings, /bookings/:id, etc.
│   └── types/
│       ├── api.types.ts    # ApiBookingListResponse, ApiBookingItem, etc.
│       └── domain.types.ts # BookingSummary, DetailedBooking, BookingResult

├── catalog/                # Service catalog feature
│   ├── components/         # ServiceCard, CategoryFilter, CatalogGrid
│   ├── hooks/              # useServices, useCategories, useServiceDetails
│   ├── mappers/            # catalog.mapper.ts
│   ├── services/           # catalog.service.ts — calls /catalog/services, /catalog/categories
│   └── types/

├── customer-dashboard/     # Customer home dashboard widgets
│   ├── components/
│   └── hooks/

├── profile/                # Customer profile & addresses
│   ├── components/         # ProfileForm, AddressCard, AddressForm
│   ├── hooks/              # useProfile, useProfileAddresses, useUpdateProfile, etc.
│   ├── services/           # profile.service.ts — calls /users/me, /users/me/addresses
│   └── types/

├── reviews/                # Review creation & listing
│   ├── components/
│   ├── hooks/              # useReviews, useCreateReview
│   ├── mappers/
│   ├── services/           # review.service.ts — calls /reviews
│   └── types/

├── service-details/        # Service detail page components (not to be confused with catalog)
│   └── components/         # ServiceHeader, ProviderList, FAQAccordion, etc.

├── wallet/                 # Wallet & transaction history
│   ├── components/         # WalletCard, TransactionList
│   ├── hooks/              # useWallet
│   ├── mappers/            # wallet.mapper.ts
│   ├── services/           # wallet.service.ts — calls /wallets/me
│   └── types/

├── provider/               # Provider module (profile, services, bookings)
│   ├── bookings/           # Provider booking management
│   │   ├── components/     # ProviderBookingList, BookingStatusUpdater
│   │   ├── hooks/          # useProviderBookings, useUpdateBookingStatus
│   │   ├── query/          # provider-booking.keys.ts
│   │   ├── services/       # provider-bookings.service.ts
│   │   └── types/
│   ├── profile/            # Provider profile & document management
│   │   ├── components/     # ProviderProfileManager, ProviderDocumentsManager, UploadDocumentDialog
│   │   ├── constants/      # verification-status badge map
│   │   ├── hooks/          # useProviderProfile, useUpdateProviderProfile, useProviderDocuments, etc.
│   │   ├── services/       # provider-profile.service.ts, provider-documents.service.ts
│   │   └── types/
│   └── services/           # Provider services, availability, time-off management
│       ├── components/     # ProviderServicesManager, ProviderAvailabilityManager, etc.
│       ├── hooks/          # useProviderServices, useProviderAvailability, useProviderTimeOff
│       ├── services/       # provider-services.service.ts, provider-availability.service.ts, etc.
│       └── types/

└── admin/                  # Admin module (bookings, disputes)
    ├── bookings/           # Admin booking management
    │   ├── components/     # AdminBookingList, AdminBookingDetails
    │   ├── hooks/          # useAdminBookings, useAdminBooking, useUpdateAdminBookingStatus
    │   ├── services/       # admin-bookings.service.ts
    │   └── (reuses booking DTOs and mappers from features/booking/)
    └── disputes/           # Admin dispute management
        ├── components/     # AdminDisputeList, AdminDisputeDetails, DisputeMessageList, etc.
        ├── hooks/          # useAdminDisputes, useAdminDispute, useResolveDispute, useAddDisputeMessage
        ├── mappers/        # dispute.mapper.ts
        ├── services/       # admin-disputes.service.ts
        └── types/
            ├── api.types.ts    # ApiDisputeResponse, ApiDisputeListResponse
            └── domain.types.ts # Dispute, DisputeMessage domain models
```

---

## `src/components/` — Shared UI Components

```
src/components/
└── ui/                     # shadcn/ui primitive components
    ├── accordion.tsx
    ├── avatar.tsx
    ├── badge.tsx
    ├── breadcrumb.tsx
    ├── button.tsx
    ├── card.tsx
    ├── checkbox.tsx
    ├── dialog.tsx
    ├── dropdown-menu.tsx
    ├── input.tsx
    ├── label.tsx
    ├── select.tsx
    ├── separator.tsx
    ├── sheet.tsx
    ├── textarea.tsx
    └── tooltip.tsx
```

These are the **only** shared UI building blocks. All feature-level composition is done in `features/<name>/components/`. Never add application-specific logic to this folder.

---

## `src/providers/` — React Context Providers

```
src/providers/
├── AuthProvider.tsx        # Session management, login/logout, user context
├── QueryProvider.tsx       # TanStack React Query client (with devtools in development)
├── SidebarProvider.tsx     # Sidebar open/close state
├── ThemeProvider.tsx       # Dark/light theme context
└── index.tsx               # Composes all providers into a single <Providers> wrapper
```

The root `layout.tsx` wraps the entire app in `<Providers>`, making all contexts available to every page.

---

## `src/lib/` — Infrastructure

```
src/lib/
└── api.ts                  # Axios singleton
                            #   - Single instance for the entire app
                            #   - baseURL from NEXT_PUBLIC_API_URL
                            #   - 15s timeout
                            #   - Request interceptor: injects JWT Bearer token
                            #   - Response interceptor: clears auth + redirects on 401
```

---

## `src/constants/` — Application Constants

```
src/constants/
├── routes.ts               # All frontend page URLs (use ROUTES.X instead of strings)
├── apiRoutes.ts            # All backend API endpoint paths (use API_ROUTES.X in services)
├── navigation.ts           # Sidebar navigation items per role (links, icons, labels)
├── roles.ts                # UserRole enum (CUSTOMER, PROVIDER, ADMIN)
├── storageKeys.ts          # localStorage key constants (AUTH_TOKEN, USER)
└── index.ts                # Barrel export
```

---

## `src/utils/` — Utility Functions

```
src/utils/
└── parseApiError.ts        # Extracts a human-readable string from any error
                            # Handles: field validation errors, business errors,
                            # network errors, timeout, HTTP status fallbacks.
                            # Also exports isApiNotFoundError(error): boolean
```

---

## `src/shared/` — Shared Domain Types

```
src/shared/
└── types/
    └── address/
        └── domain.types.ts     # Address domain model (used by both profile and booking)
```

Types in `shared/` are the only cross-feature types allowed. This prevents feature modules from importing each other directly.

---

## `src/types/` — Global TypeScript Types

```
src/types/
└── api.ts                  # Shared API shapes:
                            #   - ApiErrorResponse (used by parseApiError)
                            #   - ApiSuccessResponse<T> base wrapper type
```

---

## `src/hooks/` — Global Utility Hooks

```
src/hooks/
├── index.ts
└── useIsClient.ts          # Returns true only after client-side hydration
                            # Used to prevent SSR/hydration mismatches for
                            # localStorage-dependent components
```

---

## `src/validations/` — Shared Zod Schemas

Shared validation schemas that are referenced from multiple features (e.g. password strength rules, phone number format).
