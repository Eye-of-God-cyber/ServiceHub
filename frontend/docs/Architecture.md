# Architecture Document — ServiceHub Frontend

## 1. Overview

The ServiceHub frontend is a **Next.js 16 (App Router)** application built on a strict, layered architecture. Every design decision was made to support maintainability, testability, and clear separation of concerns. This document describes the architectural patterns, rationale, and conventions that govern the codebase.

---

## 2. Core Architectural Principle: Strict Unidirectional Data Flow

The application enforces a single, non-negotiable rule:

> **Data flows in one direction only. No layer may reach "upward" or "sideways" — it may only call the layer immediately below it.**

```
┌─────────────────────────────────────────┐
│             Pages / Layouts             │  Next.js App Router pages
│  (app/(customer)/bookings/page.tsx)     │  — Orchestrate page structure
└──────────────────┬──────────────────────┘
                   │ renders
┌──────────────────▼──────────────────────┐
│       Presentational Components         │  Feature components
│  (features/booking/components/...)      │  — Display data, fire user events
│                                         │  — NEVER import Axios or fetch
└──────────────────┬──────────────────────┘
                   │ calls
┌──────────────────▼──────────────────────┐
│         React Query Hooks               │  TanStack React Query
│  (features/booking/hooks/useBookings)   │  — Cache management, loading/error states
│                                         │  — Calls Feature Services
└──────────────────┬──────────────────────┘
                   │ calls
┌──────────────────▼──────────────────────┐
│           Feature Services              │  Plain async TypeScript functions
│  (features/booking/services/...)        │  — The ONLY layer that calls Axios
│                                         │  — Returns raw API DTOs
└──────────────────┬──────────────────────┘
                   │ uses
┌──────────────────▼──────────────────────┐
│        Axios (src/lib/api.ts)           │  HTTP client singleton
│                                         │  — JWT injection via interceptor
│                                         │  — 401 → auto-logout + redirect
└──────────────────┬──────────────────────┘
                   │ calls
┌──────────────────▼──────────────────────┐
│        ServiceHub Backend REST API      │  Node.js / Express / PostgreSQL
│  (http://localhost:5000/api/v1/...)     │
└─────────────────────────────────────────┘
```

---

## 3. Data Transformation Pipeline (DTO → Domain Model)

API responses are never used raw in the UI. They pass through a mandatory transformation pipeline:

```
Backend JSON ──► API DTO ──► Mapper ──► Domain Model ──► Component
```

### Why?

The **backend contract** (API DTO) and the **frontend contract** (Domain Model) are separate concerns. This decoupling means:

- If the backend renames a field (e.g. `providerService.price` → `providerService.customPrice`), only the **mapper** changes — zero component changes.
- Domain models can be enriched with derived fields (e.g. `effectivePrice = customPrice ?? basePrice`) that don't exist in the raw API.
- Components always consume **clean, typed, business-level objects** — never raw API shapes.

### Concrete Example (Booking Feature)

```
Backend: GET /api/v1/bookings
         → ApiBookingListResponse { data: { bookings: ApiBookingItem[], pagination: ... } }

services/booking.service.ts
         → Calls api.get('/bookings'), returns ApiBookingListResponse

mappers/booking.mapper.ts
         → mapBookingListToDomain(dto) → BookingSummary[]
           (converts date strings to Date objects, flattens nested objects, etc.)

hooks/useBookings.ts
         → useQuery({ queryFn: () => bookingService.getBookings() })
         → Exposes BookingSummary[] to components

components/BookingList.tsx
         → Renders BookingSummary[] — no knowledge of HTTP or raw DTOs
```

---

## 4. File Conventions Per Feature

Every feature module (`src/features/<name>/`) follows an identical internal structure:

| Directory | Purpose |
|-----------|---------|
| `components/` | Pure presentational React components. Accept domain models as props. Never call hooks directly — receive data as props. |
| `hooks/` | React Query hooks (`useQuery`, `useMutation`). Bridge between components and services. Own all loading/error state. |
| `services/` | Plain async TypeScript functions. **Only location where Axios is used.** Return raw API DTOs. |
| `mappers/` | Pure transformation functions. `mapXxxToDomain(dto): DomainModel`. No side effects, no async. |
| `types/api.types.ts` | TypeScript interfaces for backend DTOs. Named `ApiXxx`. |
| `types/domain.types.ts` | TypeScript interfaces for frontend domain models. Named after the entity (e.g. `Booking`, `ProviderProfile`). |
| `query/` | React Query key factories. Ensures consistent cache key structure. |

---

## 5. Authentication Architecture

Authentication is handled by `AuthProvider` (`src/providers/AuthProvider.tsx`) which:

1. **Stores** the JWT token and user profile in `localStorage` on login.
2. **Exposes** `user`, `isAuthenticated`, `login()`, `logout()` via React Context.
3. **Reads** tokens on mount to restore session across page reloads.

The **Axios interceptor** (`src/lib/api.ts`) reads the token directly from `localStorage` (not from `AuthContext`) to avoid a circular dependency between the HTTP module and the React context tree.

On a **401 response**, the interceptor clears auth storage and redirects to `/login` automatically — the user is never stuck in an authenticated-but-rejected state.

### Route Protection

| Guard | Location | Behavior |
|-------|----------|---------|
| `AuthGuard` | Layout files | Redirects unauthenticated users to `/login` |
| `RoleGuard` | Layout files | Redirects authenticated users with wrong role to their home route |

Route groups in the App Router enforce isolation:
- `(auth)/` — Public only. Authenticated users are redirected away.
- `(customer)/` — Requires `CUSTOMER` role.
- `(provider)/` — Requires `PROVIDER` role.
- `(admin)/` — Requires `ADMIN` role.

---

## 6. React Query Conventions

- **Query Keys** are defined in `query/<feature>.keys.ts` as factory functions (e.g. `bookingKeys.lists()`, `bookingKeys.detail(id)`). This ensures consistent cache invalidation.
- **staleTime** is not globally configured — each query uses defaults appropriate to its data freshness requirements.
- **Mutations** always invalidate relevant query caches in `onSuccess` to keep the UI in sync without manual state management.
- **Error handling** in mutations uses `parseApiError()` — a shared utility in `src/utils/parseApiError.ts` — to extract human-readable error messages regardless of the HTTP status code.

---

## 7. Error Handling Philosophy

Errors are handled at the boundary closest to the user:

- **Service Layer**: Does not catch errors. Lets Axios errors propagate.
- **Hook Layer**: `onError` callbacks use `parseApiError()` to format the message for display. Never catches raw `AxiosError`.
- **Component Layer**: Receives `error` state from hooks. Renders error UI without any knowledge of HTTP.
- **Global (Axios interceptor)**: Handles 401 globally — redirects to login.
- **`parseApiError()`**: The single source of truth for error message extraction. Handles field validation errors, business errors, network errors, and HTTP status code fallbacks.

---

## 8. Why These Choices Were Made

| Decision | Rationale |
|----------|-----------|
| **Next.js App Router** | Server components, layouts, route groups, and built-in TypeScript support. |
| **TanStack React Query** | Eliminates manual loading/error/cache state management. Provides deduplication, background refetching, and optimistic updates out of the box. |
| **Feature-based folder structure** | Each feature is self-contained. New developers can understand a feature without reading the whole codebase. |
| **DTO → Mapper → Domain** | Decouples frontend from backend contract changes. Enables derived data fields. |
| **Zod for validation** | Schema-first validation that works both at the form level (via `@hookform/resolvers`) and at runtime. |
| **Axios over fetch** | Automatic JSON parsing, interceptors for JWT injection and 401 handling, request timeout, and TypeScript generics for response types. |
| **No Axios in components** | Components are pure UI. They cannot be broken by backend changes. Testable without mocking HTTP. |
