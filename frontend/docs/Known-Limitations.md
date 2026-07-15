# Known Limitations — ServiceHub Frontend

This document records all frontend features that are **intentionally absent** from the current implementation due to missing backend API support.

> **Project Rule**: The ServiceHub frontend is built strictly backend-first. The backend REST API is the single source of truth. No frontend implementation is created for a feature if the required HTTP endpoints do not exist. This prevents the accumulation of dead, broken, or mocked frontend code.

---

## Summary Table

| Feature | Milestone | Status | Reason |
|---------|-----------|--------|--------|
| Admin User Management | 4B | ⛔ Blocked | No backend API endpoints exist |
| Admin Provider Management | 4B | ⛔ Blocked | No backend API endpoints exist |
| Coupon Management | 4C | ⛔ Blocked | No backend API endpoints exist |
| Reports & Analytics | 4D | ⛔ Blocked | No backend API endpoints exist |

---

## 1. Admin User Management

**Milestone**: 4B — Admin User & Provider Management

**What was expected**:
- List all platform users with pagination and search
- View individual user details
- Update user status (active/suspended)
- Assign or change user roles

**Why it is blocked**:
The backend does not expose any HTTP endpoints for listing, filtering, or managing users. A thorough research of the backend source code (`src/modules/`) confirmed there is no users module accessible to the admin role. Listing users via the `/users/me` endpoint is not applicable — it only returns the current user's own profile.

**No frontend implementation exists because the backend does not currently expose the required APIs.**

**Required backend endpoints (not yet implemented)**:
```
GET    /admin/users              — List all users with pagination + search
GET    /admin/users/:id          — Get user detail
PATCH  /admin/users/:id/status   — Update user status
```

---

## 2. Admin Provider Management

**Milestone**: 4B — Admin User & Provider Management

**What was expected**:
- List all providers with verification status filters
- View individual provider details including documents
- Approve or reject provider verification
- Suspend or reinstate providers

**Why it is blocked**:
The backend does not expose any HTTP endpoints for listing or managing providers from an admin perspective. The only provider-related admin endpoint is `PATCH /admin/documents/:docId/status` — which handles individual document status updates, not provider-level management.

**No frontend implementation exists because the backend does not currently expose the required APIs.**

**Required backend endpoints (not yet implemented)**:
```
GET    /admin/providers              — List all providers with pagination + filters
GET    /admin/providers/:id          — Get provider detail
PATCH  /admin/providers/:id/status   — Update provider status (ACTIVE/SUSPENDED)
```

---

## 3. Coupon Management

**Milestone**: 4C — Admin Booking, Coupon & Dispute Management

**What was expected**:
- List all platform coupons
- Create new coupons (code, discount type, value, expiry, usage limits)
- Edit existing coupons
- Delete coupons
- View coupon usage statistics

**Why it is blocked**:
The backend Prisma schema includes a `Coupon` model and the booking creation endpoint accepts a `couponCode` field, indicating coupons are applied at booking time by the backend. However, no HTTP endpoints exist for CRUD operations on coupons from the admin side. A search of the entire backend `src/modules/` directory for coupon-related route handlers returned zero results.

**No frontend implementation exists because the backend does not currently expose the required APIs.**

**Required backend endpoints (not yet implemented)**:
```
GET    /admin/coupons           — List all coupons
POST   /admin/coupons           — Create a coupon
PATCH  /admin/coupons/:id       — Update a coupon
DELETE /admin/coupons/:id       — Delete a coupon
```

---

## 4. Reports & Analytics

**Milestone**: 4D — Admin Reports & Analytics

**What was expected**:
- Platform revenue summary
- Booking volume over time (time-series charts)
- User and provider growth statistics
- Category performance breakdown
- KPI dashboard with key platform metrics
- Wallet and payment analytics

**Why it is blocked**:
A comprehensive audit of the backend codebase found **zero** reporting or analytics endpoints. Specifically:
- No `reports` module exists in `src/modules/`
- No `stats`, `analytics`, `revenue`, or `dashboard` route handlers exist
- No aggregation queries are exposed via any HTTP endpoint
- No time-series data endpoints exist

The backend does not generate or expose any aggregated reporting data. If statistics are produced only internally (e.g. as raw Prisma queries with no HTTP layer), they are considered unsupported for frontend use.

**No frontend implementation exists because the backend does not currently expose the required APIs.**

**Required backend endpoints (not yet implemented)**:
```
GET  /admin/reports/dashboard   — Platform KPI summary
GET  /admin/reports/revenue     — Revenue by time period
GET  /admin/reports/bookings    — Booking statistics and trends
GET  /admin/reports/users       — User growth statistics
```

---

## Placeholder Pages

The following pages exist in the route structure as **UI shells** to maintain navigation consistency. They render a simple "Not yet available" message and contain no real data or backend integration:

| Route | Placeholder for |
|-------|----------------|
| `/admin/users` | Admin User Management |
| `/admin/providers` | Admin Provider Management |
| `/admin/coupons` | Coupon Management |
| `/admin/reports` | Reports & Analytics |

These placeholders will be replaced with full implementations once the required backend APIs are delivered.

---

## How to Implement a Blocked Feature

Once the backend team delivers the missing APIs, follow these steps to implement a previously blocked feature:

1. **Verify the backend** — Read the new route handlers, DTOs, and authorization rules.
2. **Create API types** — Add `ApiXxxResponse` types in `features/<name>/types/api.types.ts`.
3. **Create domain types** — Add clean domain models in `features/<name>/types/domain.types.ts`.
4. **Create mapper** — Write `map<Xxx>ToDomain(dto)` in `features/<name>/mappers/<name>.mapper.ts`.
5. **Create service** — Write API call functions in `features/<name>/services/<name>.service.ts`.
6. **Create React Query hooks** — Add query key factory and `useQuery`/`useMutation` hooks.
7. **Build components** — Create presentational components consuming only domain models.
8. **Wire up the page** — Replace the placeholder page with the real feature page.
9. **Run `npm run lint` and `npm run build`** — Confirm zero errors before submitting.
