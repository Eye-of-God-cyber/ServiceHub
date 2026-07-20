<div align="center">

# ServiceHub API

### Production-Grade REST API for a Multi-Vendor Home Services Marketplace

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma_ORM-5.x-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0.3-6BA539?logo=swagger&logoColor=white)](https://servicehub-api-13vx.onrender.com/api-docs/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

ServiceHub is a production-grade backend system that powers a multi-vendor home services marketplace — connecting customers with verified service professionals for on-demand doorstep services such as plumbing, electrical work, deep cleaning, AC servicing, and carpentry.

**Core demonstration:** Relational database engineering · PostgreSQL · Prisma ORM · JWT authentication · Role-based access control · REST API design · Backend security patterns · Concurrent-safe transactions

</div>

---

## 🌐 Live API Documentation

**Swagger UI**

https://servicehub-api-13vx.onrender.com/api-docs/

**OpenAPI JSON**

https://servicehub-api-13vx.onrender.com/api-docs.json

---

## Table of Contents

1. [What is ServiceHub?](#1-what-is-servicehub)
2. [Architecture Overview](#2-architecture-overview)
3. [Database Design](#3-database-design)
4. [ER Diagram](#4-er-diagram)
5. [Database Modules](#5-database-modules)
6. [REST API Reference](#6-rest-api-reference)
7. [Swagger Documentation](#7-swagger-documentation)
8. [Project Structure](#8-project-structure)
9. [Backend Features](#9-backend-features)
10. [Security](#10-security)
11. [Installation](#11-installation)
12. [Environment Variables](#12-environment-variables)
13. [Database Initialization](#13-database-initialization)
14. [Running the Server](#14-running-the-server)
15. [Deployment](#15-deployment)
16. [API Usage Examples](#16-api-usage-examples)
17. [Performance Benchmarks & Considerations](#17-performance-benchmarks--considerations)
18. [Known Limitations](#18-known-limitations)
19. [Future Improvements](#19-future-improvements)
20. [Contributing](#20-contributing)
21. [License](#21-license)

---

## 1. What is ServiceHub?

ServiceHub solves the discovery and trust problem in the home services industry. Finding a reliable, vetted plumber or electrician is time-consuming and unreliable through informal channels. ServiceHub provides a structured platform where:

- **Customers** browse a verified service catalog, book appointments at a specific address, track the job lifecycle in real time, pay through a wallet or payment gateway, and leave reviews.
- **Providers** (service professionals) manage their profile, upload verification documents, configure their weekly availability, list the services they offer with custom pricing, accept or reject bookings, and receive earnings in their wallet.
- **Admins** approve provider verification documents, resolve customer–provider disputes, and maintain the service catalog.

### Booking Lifecycle

```
Customer browses catalog
       │
       ▼
Customer creates booking ── status: PENDING
       │
       ▼
Provider confirms ── status: CONFIRMED ──► Customer or Provider cancels ── status: CANCELLED
       │
       ▼
Provider starts job ── status: IN_PROGRESS ──► Customer no-show ── status: NO_SHOW
       │
       ▼
Provider marks complete ── status: COMPLETED
       │
       ▼
Customer submits review ──► Provider replies to review
       │
       ▼
Earnings settled to Provider wallet
```

Every status transition is logged in an immutable `booking_status_history` audit table, recording who triggered the change and when.

---

## 2. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                         HTTP Client                              │
│             (REST client, Swagger UI, mobile app)                │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                    Middleware Pipeline                            │
│  helmet → cors → json parser → hpp → morgan → rate limiter       │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                   Express Router (routes/index.js)               │
│          Dispatches to the correct feature module router         │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│               Auth + Role Middleware                              │
│  JWT extraction, signature verification, user status check,      │
│  role attachment, RBAC enforcement per route group               │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│         Validation Middleware (express-validator schemas)         │
│  Per-route field validation → collects all errors →              │
│  throws AppError(400) with per-field messages                    │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                  Controller (thin layer)                         │
│  Extracts validated request data → calls service →              │
│  wraps result in ApiResponse JSON envelope                       │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                 Service Layer (business logic)                   │
│  Domain rules, state machine enforcement, Prisma transactions,   │
│  atomic wallet operations, coupon enforcement, AppError throws   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│               Prisma ORM  →  PostgreSQL 16                       │
│  100% parameterized queries · type-safe query builder ·          │
│  Prisma Migrate for version-controlled schema management         │
└──────────────────────────────────────────────────────────────────┘
```

### Middleware Pipeline

| Order | Middleware | Purpose |
|-------|-----------|---------|
| 1 | `helmet` | ~14 security headers (CSP, HSTS, X-Frame-Options, etc.) |
| 2 | `cors` | Enforces a configured origin allowlist |
| 3 | `express.json` | Parses JSON request bodies, capped at 10 KB |
| 4 | `hpp` | Strips duplicate HTTP query parameters |
| 5 | `morgan` | HTTP access logging |
| 6 | `globalLimiter` | Rate limits all `/api` routes (100 req / 15 min default) |
| 7 | `authenticate` | Verifies JWT, loads user + roles, checks account status |
| 8 | `authorize` | Enforces RBAC — throws 403 if required role is absent |
| 9 | `express-validator` | Per-route field validation schemas |
| 10 | `validate` | Collects all validation errors → throws `AppError(400)` |
| 11 | `errorHandler` | Catches `AppError` and unexpected exceptions → returns JSON |

---

## 3. Database Design

### At a Glance

| Property | Value |
|----------|-------|
| Database | PostgreSQL 16 |
| ORM | Prisma 5.x |
| Schema | `prisma/schema.prisma` (~1,255 lines) |
| Tables | **28** |
| Enums | **17** |
| Normalization | 3NF with deliberate, documented denormalization |
| User primary key | UUID — prevents sequential ID enumeration attacks |
| All other PKs | Auto-increment integer — lighter joins, simpler FK references |
| Monetary fields | `Decimal(10,2)` — exact arithmetic, no IEEE 754 rounding |
| Geospatial fields | `Decimal(10,7)` on lat/lng — approximately 1 cm precision |

### All 28 Tables

| Table | Module | Description |
|-------|--------|-------------|
| `roles` | Auth | Master role list: `CUSTOMER`, `PROVIDER`, `ADMIN` |
| `users` | Auth | Authentication identity — UUID PK, bcrypt hash, account status |
| `user_roles` | Auth | M:N junction: user ↔ role with assignment timestamp |
| `user_profiles` | Users | Customer display names, avatar, date of birth |
| `provider_profiles` | Providers | Bio, experience, verification status, denormalized `avg_rating` / `total_reviews` |
| `provider_documents` | Providers | Verification files with per-document `PENDING/APPROVED/REJECTED` status |
| `provider_availability` | Providers | Recurring weekly schedule — one row per day-of-week per provider |
| `provider_time_off` | Providers | Date-range exceptions (vacations, sick days) |
| `provider_services` | Providers | M:N junction: provider ↔ service with optional `custom_price` |
| `service_categories` | Catalog | Top-level groupings with sort order and icon URL |
| `services` | Catalog | Admin-curated bookable services with base price and pricing unit |
| `addresses` | Users | Customer saved addresses with geospatial coordinates |
| `bookings` | Bookings | **Core fact table** — immutable financial snapshot at creation |
| `booking_status_history` | Bookings | Append-only audit trail of every status transition |
| `payments` | Payments | Multiple payment attempts per booking; raw gateway JSON stored |
| `wallets` | Wallet | Running balance per user — denormalized from ledger for performance |
| `wallet_transactions` | Wallet | Immutable append-only ledger with `balance_before`/`balance_after` |
| `reviews` | Reviews | 1:1 per completed booking, integer rating 1–5 |
| `review_replies` | Reviews | Provider's single response to a customer review |
| `disputes` | Disputes | Support ticket raised against a booking |
| `dispute_messages` | Disputes | Threaded message conversation within a dispute |
| `notifications` | Notifications | In-app feed — typed enum drives icon and deep-link behavior |
| `coupons` | Coupons | Admin discount codes: `PERCENTAGE` or `FLAT` with validity window |
| `coupon_usages` | Coupons | Per-user redemption tracking for limit enforcement |
| `otp_verifications` | Auth | Short-lived OTP codes for email/phone/password-reset flows |

### All 17 Enums

| Enum | Values |
|------|--------|
| `UserStatus` | `ACTIVE` · `INACTIVE` · `SUSPENDED` · `BANNED` |
| `RoleName` | `CUSTOMER` · `PROVIDER` · `ADMIN` |
| `OtpPurpose` | `EMAIL_VERIFICATION` · `PHONE_VERIFICATION` · `PASSWORD_RESET` |
| `VerificationStatus` | `PENDING` · `UNDER_REVIEW` · `APPROVED` · `REJECTED` |
| `DocumentType` | `ID_PROOF` · `ADDRESS_PROOF` · `CERTIFICATION` · `POLICE_VERIFICATION` · `OTHER` |
| `DayOfWeek` | `MONDAY` · `TUESDAY` · `WEDNESDAY` · `THURSDAY` · `FRIDAY` · `SATURDAY` · `SUNDAY` |
| `BookingStatus` | `PENDING` · `CONFIRMED` · `IN_PROGRESS` · `COMPLETED` · `CANCELLED` · `NO_SHOW` |
| `PaymentStatus` | `PENDING` · `SUCCESS` · `FAILED` · `REFUNDED` |
| `PaymentMethod` | `WALLET` · `CARD` · `UPI` · `CASH` · `NET_BANKING` |
| `WalletTransactionType` | `CREDIT` · `DEBIT` |
| `WalletTransactionStatus` | `PENDING` · `COMPLETED` · `FAILED` · `REVERSED` |
| `DisputeStatus` | `OPEN` · `IN_REVIEW` · `RESOLVED` · `CLOSED` |
| `NotificationType` | `BOOKING_UPDATE` · `PAYMENT` · `REVIEW_REQUEST` · `PROMOTIONAL` · `SYSTEM` · `DISPUTE` |
| `CouponType` | `PERCENTAGE` · `FLAT` |
| `CouponStatus` | `ACTIVE` · `INACTIVE` · `EXPIRED` |

### Key Engineering Decisions

**UUID primary keys for `users`**
Sequential integer IDs expose the total user count and allow trivial account enumeration. UUID PKs eliminate this at zero application-code cost. All other tables use auto-increment integers — lower storage overhead for high-volume FK references.

**Immutable ledger tables**
`wallet_transactions` and `booking_status_history` have **no `updatedAt` field** by design. Rows are insert-only and must never be modified. Each `wallet_transactions` row stores `balance_before` and `balance_after` so point-in-time balance reconstruction is possible without replaying the full ledger.

**Denormalized aggregates on `provider_profiles`**
`avg_rating`, `total_reviews`, and `total_bookings` are maintained by the service layer inside the same transaction as each write. Public catalog queries never execute `AVG()` or `COUNT()` against the reviews table — the aggregation happens once per write, not on every read.

**Atomic concurrent-safe operations**
Wallet debits and coupon `usageCount` increments use Prisma's atomic `increment`/`decrement` operators. Constraint checks (balance ≥ 0, usageCount ≤ maxUsage) run **after** the atomic update — not before — eliminating the TOCTOU (Time-of-Check / Time-of-Use) window inherent in a read-then-write approach.

**Price snapshot at booking creation**
`bookings` stores `baseAmount`, `discountAmount`, and `totalAmount` as immutable snapshots. Future price changes and coupon expiry never retroactively alter existing financial records.

**Explicit cascade behaviors**

| Behavior | When Used | Rationale |
|----------|-----------|-----------|
| `Cascade` | Profiles, availability, notifications | Child has no standalone meaning without its parent |
| `Restrict` | Bookings, payments, wallet transactions, reviews | Protect financial and audit records from accidental deletion |
| `SetNull` | `booking_status_history.changed_by_id`, `bookings.coupon_id` | Preserve audit/financial record when the referenced entity is removed |

**`Decimal(10,2)` for all monetary values**
Maps to PostgreSQL `NUMERIC(10,2)`. Avoids IEEE 754 floating-point rounding that occurs with JavaScript `number` or PostgreSQL `float8`. Applied consistently across all price, balance, and discount fields.

### Index Strategy

```sql
-- Fast user authentication
CREATE UNIQUE INDEX ON users (email);
CREATE UNIQUE INDEX ON users (phone);

-- Provider discovery catalog
CREATE INDEX ON provider_profiles (verification_status);
CREATE INDEX ON provider_profiles (is_available);
CREATE INDEX ON provider_services (provider_id);
CREATE INDEX ON provider_services (service_id);
CREATE INDEX ON provider_documents (provider_id);
CREATE INDEX ON provider_documents (status);              -- admin review queue
CREATE INDEX ON provider_availability (provider_id);
CREATE INDEX ON provider_time_off (provider_id);
CREATE INDEX ON provider_time_off (start_date, end_date); -- date range overlap queries

-- Service catalog browsing
CREATE INDEX ON services (category_id);
CREATE INDEX ON services (is_active);
CREATE INDEX ON service_categories (is_active);

-- Customer address lookup
CREATE INDEX ON addresses (user_id);
CREATE INDEX ON addresses (pincode);                      -- area-based filtering

-- Booking queries (the most common queries in the system)
CREATE INDEX ON bookings (customer_id);                   -- "my bookings"
CREATE INDEX ON bookings (provider_id);                   -- "my jobs"
CREATE INDEX ON bookings (status);                        -- dashboard filtering
CREATE INDEX ON bookings (scheduled_at);                  -- calendar/schedule views
CREATE INDEX ON booking_status_history (booking_id);      -- booking timeline

-- Financial queries
CREATE INDEX ON wallet_transactions (wallet_id);
CREATE INDEX ON wallet_transactions (status);
CREATE INDEX ON payments (booking_id);
CREATE INDEX ON payments (status);

-- Notifications (badge count is the most frequent query)
CREATE INDEX ON notifications (user_id);
CREATE INDEX ON notifications (user_id, is_read);         -- unread badge count

-- Dispute management
CREATE INDEX ON disputes (booking_id);
CREATE INDEX ON disputes (raised_by_id);
CREATE INDEX ON disputes (status);                        -- admin dashboard
CREATE INDEX ON dispute_messages (dispute_id);

-- Coupon per-user enforcement
CREATE INDEX ON coupon_usages (coupon_id, user_id);       -- limit check
CREATE INDEX ON coupon_usages (user_id);
CREATE INDEX ON coupons (status);
```

---

## 4. ER Diagram

The following Entity Relationship Diagram represents the complete ServiceHub database schema, including all tables, primary keys, foreign keys, and relationships.

<p align="center">
  <img src="./docs/er_diagram.png"
       alt="ServiceHub ER Diagram"
       width="100%">
</p>

For a scalable vector version suitable for printing and zooming, see:

- 📄 `docs/er_diagram.pdf`
- 🗂️ `docs/er_diagram.dbml`

### Entity Relationship Summary

```
users ──────────────────────────────┬── user_profiles          (1:1, Cascade)
  │                                 ├── provider_profiles       (1:1, Cascade)
  │                                 │     ├── provider_services      (1:N, Cascade on provider)
  │                                 │     ├── provider_availability  (1:N, Cascade)
  │                                 │     ├── provider_time_off      (1:N, Cascade)
  │                                 │     ├── provider_documents     (1:N, Cascade)
  │                                 │     ├── bookings [provider]    (1:N, Restrict)
  │                                 │     ├── reviews                (1:N, Restrict)
  │                                 │     └── review_replies         (1:N, Restrict)
  │                                 ├── wallets                 (1:1, Cascade)
  │                                 │     └── wallet_transactions    (1:N, Restrict)
  │                                 ├── addresses               (1:N, Cascade)
  │                                 ├── bookings [customer]     (1:N, Restrict)
  │                                 ├── reviews [author]        (1:N, Restrict)
  │                                 ├── disputes                (1:N, Restrict)
  │                                 ├── dispute_messages        (1:N, Restrict)
  │                                 ├── notifications           (1:N, Cascade)
  │                                 ├── coupon_usages           (1:N, Restrict)
  │                                 └── otp_verifications       (1:N, Cascade)
  │
roles ──────────────────────────────── user_roles (M:N via junction, Cascade/Restrict)

bookings ───────────────────────────┬── booking_status_history  (1:N, Cascade, actor SetNull)
  │                                 ├── payments                (1:N, Restrict)
  │                                 ├── wallet_transactions     (1:N, Restrict)
  │                                 ├── reviews                 (1:1, Restrict)
  │                                 ├── disputes                (1:N, Restrict)
  │                                 └── coupon_usages           (1:1, Restrict)

service_categories ──────────────── services (1:N, Restrict)
services ────────────────────────── provider_services (M:N junction, Restrict on service)
coupons ─────────────────────────── coupon_usages (1:N, Restrict)
disputes ────────────────────────── dispute_messages (1:N, Cascade)
reviews ─────────────────────────── review_replies (1:1, Cascade)
```

---

## 5. Database Modules

### Auth & Identity

| Table | Purpose |
|-------|---------|
| `roles` | Static master list of 3 roles — `CUSTOMER`, `PROVIDER`, `ADMIN` |
| `users` | Authentication identity: UUID PK, bcrypt hash, account status, verification flag |
| `user_roles` | M:N junction — a single user can hold multiple roles simultaneously |
| `otp_verifications` | Short-lived OTP codes with expiry timestamp, purpose enum, and replay-prevention flag |

### User Profiles & Addresses

| Table | Purpose |
|-------|---------|
| `user_profiles` | Display name, avatar URL, date of birth — separated from auth identity |
| `addresses` | Customer-saved service locations with full address, pincode, and `Decimal(10,7)` lat/lng |

### Provider Operations

| Table | Purpose |
|-------|---------|
| `provider_profiles` | Bio, experience years, verification status, availability flag, denormalized rating aggregates |
| `provider_documents` | Uploaded ID/certification files — per-document admin approval workflow |
| `provider_availability` | Weekly recurring schedule (one row per day of week, `@@unique([providerId, dayOfWeek])`) |
| `provider_time_off` | Date-range exceptions — vacations or sick leave (cross-referenced during availability checks) |
| `provider_services` | Services a provider offers with optional `custom_price` overriding the service's base price |

### Service Catalog

| Table | Purpose |
|-------|---------|
| `service_categories` | Top-level browsable categories with sort order and icon URL |
| `services` | Admin-curated bookable services with `basePrice`, `unit`, and `isActive` toggle |

### Booking Lifecycle

| Table | Purpose |
|-------|---------|
| `bookings` | Core fact table — 6 FK references, immutable `baseAmount`/`discountAmount`/`totalAmount`, state machine status |
| `booking_status_history` | Append-only audit log — no `updated_at` by design; records actor, status, reason, and timestamp |

### Financial System

| Table | Purpose |
|-------|---------|
| `payments` | One-to-many with bookings (multiple retry attempts); gateway response stored as raw JSON |
| `wallets` | One wallet per user; `balance` is a denormalized running total maintained by the service layer |
| `wallet_transactions` | Immutable ledger — each row stores `balance_before` and `balance_after` for point-in-time reconstruction |
| `coupons` | Admin-created discount codes with validity dates, usage limits, and per-user limits |
| `coupon_usages` | Redemption records — `@@unique(bookingId)` enforces one coupon per booking at the DB level |

### Engagement & Support

| Table | Purpose |
|-------|---------|
| `reviews` | 1:1 per completed booking (enforced by `@unique` on `bookingId`) — drives provider aggregate metrics |
| `review_replies` | Provider's single response to a customer review (1:1 with review) |
| `disputes` | Support ticket with subject, description, resolution note, and state machine status |
| `dispute_messages` | Threaded conversation within a dispute — any of the three roles may send messages |
| `notifications` | In-app notification feed — `NotificationType` enum drives icon, color, and deep-link behavior |

---

## 6. REST API Reference

**Base URL:** `https://servicehub-api-13vx.onrender.com/api/v1`

All protected routes require:
```
Authorization: Bearer <access_token>
```

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | Public | Register a new account as `CUSTOMER` or `PROVIDER` |
| `POST` | `/auth/login` | Public | Authenticate — returns access token + refresh token |
| `GET` | `/auth/me` | Any | Get the authenticated user's profile |

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/users/profile` | Any | Get the authenticated user's profile |
| `PUT` | `/users/profile` | Any | Update name, avatar, date of birth |
| `GET` | `/users/addresses` | Any | List saved addresses |
| `POST` | `/users/addresses` | Any | Create a new address |
| `PUT` | `/users/addresses/:addressId` | Any | Update an address |
| `DELETE` | `/users/addresses/:addressId` | Any | Delete an address |
| `PATCH` | `/users/addresses/:addressId/default` | Any | Set an address as default |

### Providers

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/providers/me` | PROVIDER | Get own provider profile |
| `PUT` | `/providers/me` | PROVIDER | Update bio, experience years, availability flag |
| `GET` | `/providers/documents` | PROVIDER | List uploaded verification documents |
| `POST` | `/providers/documents` | PROVIDER | Upload a verification document |
| `DELETE` | `/providers/documents/:docId` | PROVIDER | Delete a document |
| `GET` | `/providers/availability` | PROVIDER | Get weekly schedule |
| `PUT` | `/providers/availability` | PROVIDER | Upsert the weekly time-slot schedule |
| `GET` | `/providers/time-off` | PROVIDER | List time-off date ranges |
| `POST` | `/providers/time-off` | PROVIDER | Create a time-off period |
| `DELETE` | `/providers/time-off/:timeOffId` | PROVIDER | Delete a time-off period |
| `GET` | `/providers/services` | PROVIDER | List all offered services |
| `POST` | `/providers/services` | PROVIDER | Add a service to offerings |
| `PUT` | `/providers/services/:providerServiceId` | PROVIDER | Update a service offering |
| `DELETE` | `/providers/services/:providerServiceId` | PROVIDER | Remove a service offering |

### Catalog

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/catalog/categories` | Public | List all active service categories |
| `GET` | `/catalog/services` | Public | Browse services (`?categoryId=`, `?isActive=`) with pagination |
| `GET` | `/catalog/services/:id` | Public | Service detail including available providers |

### Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/bookings` | CUSTOMER | Create a booking |
| `GET` | `/bookings` | Any | List bookings for the authenticated user (`?status=`) |
| `GET` | `/bookings/:id` | Any | Booking detail including status history |
| `PATCH` | `/bookings/:id/status` | Any | Advance the booking through the state machine |

**State machine (server-enforced):**
```
PENDING    → CONFIRMED      (PROVIDER accepts)
PENDING    → CANCELLED      (CUSTOMER or PROVIDER cancels)
CONFIRMED  → IN_PROGRESS    (PROVIDER starts job)
CONFIRMED  → CANCELLED      (CUSTOMER or PROVIDER cancels)
IN_PROGRESS → COMPLETED     (PROVIDER marks complete)
IN_PROGRESS → NO_SHOW       (PROVIDER marks customer absent)
```
Invalid transitions are rejected with HTTP 400 and an explicit error message.

### Wallet

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/wallets/me` | Any | Wallet balance and paginated transaction history |

### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/reviews` | Any | List reviews (`?providerId=`, `?minRating=`) with pagination |
| `POST` | `/reviews` | CUSTOMER | Submit a review for a completed booking |
| `POST` | `/reviews/:id/reply` | PROVIDER | Reply to a customer review |

### Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/notifications` | Any | List notifications for the authenticated user |
| `PATCH` | `/notifications/:id/read` | Any | Mark a single notification as read |
| `PATCH` | `/notifications/read-all` | Any | Mark all notifications as read |

### Disputes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/disputes` | CUSTOMER | Open a dispute against a booking |
| `GET` | `/disputes` | Any | List disputes for the authenticated user |
| `GET` | `/disputes/:id` | Any | Dispute detail with full message thread |
| `POST` | `/disputes/:id/messages` | Any | Send a message in a dispute thread |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `PATCH` | `/admin/documents/:id/status` | ADMIN | Approve or reject a provider verification document |
| `PATCH` | `/admin/disputes/:id/resolve` | ADMIN | Resolve a dispute with a resolution note |

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | Public | API health check — status, environment, uptime |

**Total: 43 endpoints across 12 modules**

---

## 7. Swagger Documentation

ServiceHub ships with a fully interactive OpenAPI 3.0.3 specification generated at startup from JSDoc annotations in the route files.

| URL | Purpose |
|-----|---------|
| `https://servicehub-api-13vx.onrender.com/api-docs/` | Swagger UI (interactive) |
| `https://servicehub-api-13vx.onrender.com/api-docs.json` | Raw OpenAPI 3.0.3 JSON spec |

**Features:**
- **Authorize button** — enter your JWT access token once to authenticate all subsequent requests
- **`persistAuthorization: true`** — token survives browser page refreshes  
- **Request body schemas** — field types and validation rules documented per endpoint
- **Reusable error components** — `UnauthorizedError` (401), `ForbiddenError` (403), `NotFoundError` (404), `ValidationError` (400)
- **Two servers** — `localhost:5000` (development) and `api.servicehub.app` (production)

### Standard API Response Envelope

```json
// Success
{
  "success": true,
  "message": "Booking created successfully",
  "data": { ... }
}

// Validation failure (400)
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "scheduledAt", "message": "Must be a future date" },
    { "field": "addressId",   "message": "Address not found" }
  ]
}

// Domain or permission error
{
  "success": false,
  "message": "Booking not found"
}
```


---

## 8. Project Structure

```
ServiceHub/
├── server.js                      # Entry point — HTTP server, graceful shutdown (SIGTERM/SIGINT)
├── prisma/
│   ├── schema.prisma              # Full PostgreSQL schema (28 tables, 17 enums, ~1,255 lines)
│   ├── seed.js                    # Comprehensive seed script
│   └── migrations/                # Prisma migration history (version-controlled)
├── src/
│   ├── app.js                     # Express factory — middleware pipeline, Swagger, route mounting
│   ├── config/
│   │   ├── env.js                 # Environment variable loading with validation
│   │   ├── prisma.js              # Shared PrismaClient singleton
│   │   ├── swagger.js             # swagger-jsdoc configuration (OpenAPI 3.0.3)
│   │   ├── auth.constants.js      # JWT header name and prefix constants
│   │   └── roles.js               # ROLES enum constant
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT verification + user status check + role attachment
│   │   ├── role.middleware.js     # RBAC enforcement — throws 403 if role not present
│   │   ├── validate.js            # Collects express-validator errors → AppError(400)
│   │   ├── rateLimiter.js         # Global and auth-specific rate limiters
│   │   ├── requestLogger.js       # Morgan HTTP access logger
│   │   └── errorHandler.js        # Global error handler + 404 catch-all
│   ├── routes/
│   │   └── index.js               # Central route registry — single source of truth for URL surface
│   ├── modules/
│   │   ├── auth/                  # register · login · /me
│   │   ├── users/                 # profile (GET/PUT) · addresses (CRUD + default)
│   │   ├── providers/             # profile · documents · availability · time-off · services
│   │   ├── catalog/               # categories · services · service detail
│   │   ├── bookings/              # create · list · detail · status update (state machine)
│   │   ├── wallets/               # balance + transaction history
│   │   ├── reviews/               # list · create · provider reply
│   │   ├── notifications/         # list · mark read · mark all read
│   │   ├── disputes/              # open · list · detail · send message
│   │   ├── admin/                 # document approval · dispute resolution
│   │   └── health/
│   ├── validations/               # express-validator schemas (one file per domain)
│   ├── utils/
│   │   ├── ApiResponse.js         # Standardized JSON response envelope
│   │   ├── AppError.js            # Custom error class: statusCode + message + errors[]
│   │   ├── jwt.util.js            # Token sign + verify helpers
│   │   ├── password.util.js       # bcrypt hash + compare wrappers
│   │   ├── pagination.util.js     # getPaginationOptions + formatPaginatedResponse
│   │   ├── sanitize.util.js       # Strips HTML from text fields (XSS prevention)
│   │   └── logger.js              # Winston logger configuration
│   └── errors/                    # Domain-specific typed error classes
├── uploads/                       # Provider document file storage (local)
├── logs/                          # Winston daily-rotated log files
├── docs/                          # Technical documentation
│   ├── Architecture.md
│   ├── API_Guide.md
│   ├── Backend_Guide.md
│   ├── Database_Guide.md
│   ├── Deployment_Guide.md
│   └── Engineering_Report.md
├── .env.example
└── package.json
```

---

## 9. Backend Features

### JWT Authentication
- **Access tokens** — HS256 signed, configurable expiry (default: 15 minutes)
- **Refresh tokens** — separate secret and expiry (default: 7 days)
- **Timing-attack resistance** — `bcrypt.compare()` always executes even for unknown emails; a dummy hash prevents response-time-based email enumeration
- **Account status check** — every authenticated request verifies the user is `ACTIVE` (not `SUSPENDED`, `INACTIVE`, or `BANNED`)

### Role-Based Access Control
- Three roles: `CUSTOMER`, `PROVIDER`, `ADMIN`
- A single user may hold multiple roles simultaneously (e.g., someone who is both a customer and a registered provider)
- Role assignments stored in the `user_roles` junction table with timestamps
- `role.middleware` enforces role requirements per route — controllers never re-check roles themselves

### Input Validation
- All mutating routes use `express-validator` schemas in `src/validations/`
- Schemas are fully isolated from controllers and services
- A shared `validate` middleware collects all field errors atomically and throws a structured `AppError(400)` with per-field detail
- Immutable fields (`verificationStatus`, `avgRating`, etc.) are explicitly blocked via `.not().exists()` — callers receive a clear error rather than a silent ignore

### Pagination
All collection endpoints implement consistent offset pagination:

```json
{
  "data": [ ... ],
  "pagination": {
    "total": 238,
    "page": 2,
    "limit": 20,
    "totalPages": 12,
    "hasNextPage": true,
    "hasPreviousPage": true
  }
}
```

### Structured Logging
- **Winston** — application logging with `error`, `warn`, `info`, `http`, `debug` levels
- **Morgan** — HTTP access logging (method, path, status code, response time)
- **winston-daily-rotate-file** — automatic daily log rotation to `logs/`
- JSON-structured output compatible with Datadog, Logtail, and similar platforms

### Database Transactions
All multi-step writes execute inside Prisma transactions:

| Operation | Steps in single transaction |
|-----------|-----------------------------|
| Booking creation | Insert booking + status history row + wallet debit + wallet transaction + coupon usage |
| Booking status update | Update booking status + append status history row |
| Review submission | Insert review + atomically update `avg_rating` and `total_reviews` on provider profile |
| Wallet debit | Atomic `decrement` → verify balance ≥ 0 → rollback if insufficient |
| Coupon redemption | Atomic `increment usageCount` → verify ≤ maxUsage → rollback if exceeded |

### Rate Limiting
- **Global limiter:** 100 requests / 15 minutes per IP on all `/api` routes
- **Auth-specific limiter:** Stricter limits on login and register endpoints
- Powered by `express-rate-limit`

### Graceful Shutdown
`server.js` registers `SIGTERM` and `SIGINT` handlers. On signal: stops accepting new connections, waits for in-flight requests to drain, closes the Prisma connection pool, and exits cleanly. Essential for zero-downtime deployments.

### XSS Prevention
All free-text inputs pass through `sanitizePlainText()` which strips HTML tags before persistence — preventing stored XSS while preserving valid text without double-encoding.

---

## 10. Security

| Threat | Mitigation |
|--------|-----------|
| Brute-force login | `express-rate-limit` on auth routes + bcrypt (12 rounds, configurable) |
| Sequential user ID enumeration | UUID primary keys on `users` — no guessable integer IDs |
| Email enumeration via response timing | `bcrypt.compare()` always runs against a dummy hash for unknown emails |
| JWT tampering | HS256 with separate secrets for access and refresh tokens |
| Privilege escalation | `role.middleware` enforces RBAC on every protected route |
| Stored XSS | `sanitizePlainText()` strips HTML from all text inputs before DB write |
| Mass assignment | `express-validator` schemas explicitly define and block undeclared fields |
| Large payload attacks | `express.json({ limit: '10kb' })` caps request body size |
| Cross-origin requests | CORS allowlist — only configured origins may call the API |
| HTTP header attacks | `helmet` sets X-Frame-Options, CSP, HSTS, X-Content-Type-Options, Referrer-Policy, and more |
| HTTP Parameter Pollution | `hpp` middleware deduplicates query parameters before routing |
| SQL injection | 100% Prisma parameterized queries — zero raw SQL across the entire codebase |
| Wallet race conditions | Atomic `increment`/`decrement` inside transactions — no TOCTOU window |
| Coupon over-redemption | `usageCount` incremented atomically; checked **after** increment, rolled back if exceeded |
| Plaintext password storage | bcrypt hash with configurable salt rounds — `passwordHash` never returned in API responses |
| Stale session after account suspension | User status checked on every authenticated request, not only at login |

---

## 11. Installation

### Prerequisites

| Requirement | Minimum Version |
|-------------|----------------|
| Node.js | 18.0.0 |
| npm | 9.0.0 |
| PostgreSQL | 14 |

```bash
# 1. Clone the repository
git clone https://github.com/your-username/ServiceHub.git
cd ServiceHub

# 2. Install dependencies
npm install

# 3. Copy and configure environment variables
cp .env.example .env
# Edit .env — all required variables are listed in the next section
```

---

## 12. Environment Variables

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | `development` | Runtime environment: `development` / `production` / `test` |
| `PORT` | Yes | `5000` | Port the Express server listens on |
| `DATABASE_URL` | Yes | `postgresql://user:pass@localhost:5432/servicehub_db` | Full PostgreSQL connection string |
| `JWT_SECRET` | Yes | *(64+ random chars)* | Access token signing secret — generate with `openssl rand -base64 64` |
| `JWT_EXPIRES_IN` | Yes | `15m` | Access token lifetime |
| `JWT_REFRESH_SECRET` | Yes | *(64+ random chars)* | Refresh token signing secret — **must differ** from `JWT_SECRET` |
| `JWT_REFRESH_EXPIRES_IN` | Yes | `7d` | Refresh token lifetime |
| `CORS_ALLOWED_ORIGINS` | Yes | `http://localhost:3000` | Comma-separated list of permitted CORS origins |
| `RATE_LIMIT_WINDOW_MINUTES` | No | `15` | Rate limit window duration (default: 15) |
| `RATE_LIMIT_MAX_REQUESTS` | No | `100` | Max requests per IP per window (default: 100) |
| `LOG_LEVEL` | No | `info` | Minimum log level: `error` / `warn` / `info` / `http` / `debug` |
| `MAX_FILE_SIZE_BYTES` | No | `5242880` | Max upload size in bytes (default: 5 MB = 5242880) |
| `UPLOAD_DIR` | No | `uploads` | Directory for provider document uploads (relative to project root) |
| `BCRYPT_SALT_ROUNDS` | No | `12` | bcrypt work factor — higher is slower but more secure (default: 12) |

---

## 13. Database Initialization

```bash
# 1. Create the PostgreSQL database
psql -U postgres -c "CREATE DATABASE servicehub_db;"

# 2. Apply all migrations (creates all 28 tables with constraints and indexes)
npm run prisma:migrate

# 3. Generate the Prisma Client
npx prisma generate

# 4. Seed the database with realistic sample data
npm run seed
```

### Seed Data

| Entity | Rows |
|--------|------|
| Users | 15 (1 admin, 8 customers, 6 providers) |
| Service categories | 8 |
| Services | 32 |
| Provider service offerings | 36 |
| Bookings | 38 (all statuses represented) |
| Wallet transactions | Per user |
| Coupons | 7 |
| Reviews | 12 |
| Disputes + messages | 8 disputes with threads |
| Notifications | 229 |

**All seed passwords:** `Password@123`

| Role | Email |
|------|-------|
| Admin | `admin@servicehub.app` |
| Customer | `amit.gupta@gmail.com` |
| Provider | `rajesh.kumar@gmail.com` |

### Additional Database Commands

```bash
# Open Prisma Studio — visual database browser
npm run prisma:studio

# Deploy migrations in production (non-destructive)
npm run prisma:migrate:prod

# ⚠ Reset all data and re-run migrations (DESTRUCTIVE — dev only)
npm run prisma:reset
```

---

## 14. Running the Server

### Development
```bash
npm run dev
```
Starts with `nodemon` — automatically restarts on changes to `src/**/*` and `server.js`.

### Production
```bash
npm start
```
Starts with `node server.js` directly.

### Verify it's running

| URL | Expected |
|-----|----------|
| `http://localhost:5000/api/v1/health` | `200 OK` with health payload |
| `http://localhost:5000/api-docs` | Swagger UI |
| `http://localhost:5000/api-docs.json` | Raw OpenAPI 3.0.3 JSON |

---

## 15. Deployment

### Production Environment Variables

```bash
# Generate secure secrets
openssl rand -base64 64
```

```env
NODE_ENV=production
JWT_SECRET=<minimum 64 random characters>
JWT_REFRESH_SECRET=<different, minimum 64 random characters>
DATABASE_URL=<production PostgreSQL connection string>
BCRYPT_SALT_ROUNDS=12
LOG_LEVEL=warn
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 5000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.9'
services:
  api:
    build: .
    ports:
      - "5000:5000"
    env_file: .env
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: servicehub_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

```bash
docker-compose up -d
docker-compose exec api npx prisma migrate deploy
```

### Render

1. Create a **Web Service** → connect repository
2. **Build Command:** `npm install && npx prisma generate`
3. **Start Command:** `node server.js`
4. Add a **PostgreSQL** resource from the Render dashboard
5. Set `DATABASE_URL` from the Render database connection string
6. Add all other required environment variables
7. After first deploy, run `npx prisma migrate deploy` via the Render Shell

### Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway add --plugin postgresql
railway up
railway run npx prisma migrate deploy
```

### DigitalOcean App Platform

1. Connect repository in **App Platform**
2. **Run Command:** `node server.js`
3. Add a **Database** component — PostgreSQL managed database
4. Set `DATABASE_URL` from the DigitalOcean connection string
5. Add all required environment variables under **App-Level Env Vars**
6. After first deploy, run `npx prisma migrate deploy` via the console

---

## 16. API Usage Examples

### Register and Login

```bash
# Register as a customer
curl -X POST https://servicehub-api-13vx.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "arjun.mehta@example.com",
    "phone": "9876543210",
    "password": "SecurePass@123",
    "firstName": "Arjun",
    "lastName": "Mehta",
    "role": "CUSTOMER"
  }'

# Login
curl -X POST https://servicehub-api-13vx.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "arjun.mehta@example.com", "password": "SecurePass@123"}'

# Store token
TOKEN="<accessToken from login response>"
```

### Browse Catalog and Book a Service

```bash
# Browse categories (public — no auth required)
curl https://servicehub-api-13vx.onrender.com/api/v1/catalog/categories

# Browse plumbing services
curl "https://servicehub-api-13vx.onrender.com/api/v1/catalog/services?categoryId=1"

# Add a service address
curl -X POST https://servicehub-api-13vx.onrender.com/api/v1/users/addresses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Home",
    "line1": "42 MG Road",
    "city": "Bengaluru",
    "state": "Karnataka",
    "pincode": "560001"
  }'

# Create a booking
curl -X POST https://servicehub-api-13vx.onrender.com/api/v1/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "providerServiceId": 12,
    "addressId": 1,
    "scheduledAt": "2026-09-15T10:00:00.000Z",
    "notes": "Please bring your own tools."
  }'
```

### Provider Accepts, Works, and Completes

```bash
PTOKEN=$(curl -s -X POST https://servicehub-api-13vx.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rajesh.kumar@gmail.com","password":"Password@123"}' \
  | node -e "process.stdin.on('data',d=>process.stdout.write(JSON.parse(d).data.accessToken))")

# Confirm the booking
curl -X PATCH https://servicehub-api-13vx.onrender.com/api/v1/bookings/1/status \
  -H "Authorization: Bearer $PTOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "CONFIRMED"}'

# Mark in progress
curl -X PATCH https://servicehub-api-13vx.onrender.com/api/v1/bookings/1/status \
  -H "Authorization: Bearer $PTOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "IN_PROGRESS"}'

# Mark complete
curl -X PATCH https://servicehub-api-13vx.onrender.com/api/v1/bookings/1/status \
  -H "Authorization: Bearer $PTOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "COMPLETED"}'
```

### Submit a Review

```bash
curl -X POST https://servicehub-api-13vx.onrender.com/api/v1/reviews \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": 1,
    "rating": 5,
    "comment": "Arrived on time, excellent work. Would book again."
  }'
```

### Admin Approves a Provider Document

```bash
ATOKEN=$(curl -s -X POST https://servicehub-api-13vx.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@servicehub.app","password":"Password@123"}' \
  | node -e "process.stdin.on('data',d=>process.stdout.write(JSON.parse(d).data.accessToken))")

curl -X PATCH https://servicehub-api-13vx.onrender.com/api/v1/admin/documents/3/status \
  -H "Authorization: Bearer $ATOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "APPROVED", "adminNotes": "ID verified — clear copy received."}'
```

---

## 17. Testing

ServiceHub features a production-grade integration test suite built with **Jest** and **Supertest** to validate end-to-end API correctness, transactional safety, and database concurrency.

### Testing Architecture
- **Dedicated Test Schema:** Tests execute exclusively against a highly isolated `test_schema` on the Neon PostgreSQL database. This fully isolates test state from development and production data (`public` schema), preventing accidental deletion of real user data.
- **Safety Guards:** Destructive database operations (e.g., table truncation) are hard-blocked unless both `NODE_ENV === 'test'` and the `DATABASE_URL` connection string explicitly point to `schema=test_schema`.
- **Atomic State Reset:** Before every test runs, the `test_schema` is cleanly wiped using an atomic `TRUNCATE TABLE ... RESTART IDENTITY CASCADE` operation. This avoids unpredictable state leakage without dropping and recreating the schema, dramatically speeding up the testing lifecycle.
- **Singleton PrismaClient:** The test suite correctly imports the application's shared `PrismaClient` singleton instead of instantiating new instances. This mirrors the production environment, prevents connection pool exhaustion, and ensures Prisma middleware (like logging or soft deletes) executes accurately.

### Running Tests

```bash
# Ensure your testing database URL is set
export DATABASE_URL="postgresql://user:password@host/db?schema=test_schema"
export NODE_ENV="test"

# Run the full integration suite sequentially
npm run test
```

*Note: The test suite must be run with `--runInBand` (sequentially) to prevent race conditions during the global `beforeEach` database truncation phase.*

---

## 18. Performance Benchmarks & Considerations

### Load Testing Results

The API has been rigorously load-tested using the `autocannon` benchmarking tool to validate production engineering decisions. The load tests hit a deployed Node.js Express server connected over the network to a managed PostgreSQL database (Neon Free Tier).

**Hardware/Network Constraints:**
- The performance numbers below reflect a highly constrained environment: a single Node.js process and a free-tier database with significant network latency. 
- A simple `SELECT 1` health check maxes out at ~216 req/sec under these network constraints, establishing the absolute ceiling for this deployment tier.
- The results demonstrate stability and zero error rates under sustained concurrency.

**Test Setup:** 50 concurrent connections over 30 seconds (1500 total connections)

| Endpoint | Auth | Request Type | Avg Latency | p99 Latency | Max Latency | Throughput |
|----------|------|--------------|-------------|-------------|-------------|------------|
| `GET /api/v1/health` | Public | DB `SELECT 1` ping | 230ms | 302ms | 573ms | ~216 req/sec |
| `GET /api/v1/catalog/services` | Public | Pagination + Join (`category`) + PK Sort | 827ms | 1.18s | 1.41s | ~60 req/sec |
| `GET /api/v1/notifications` | JWT | Auth + Pagination + PK Sort | 1.13s | 1.51s | 1.68s | ~43 req/sec |

*Note: 0% error rate and 0 non-2xx status codes across all tests.*

### Index Coverage
All high-frequency access patterns have dedicated indexes — see the [Index Strategy](#index-strategy) section in Database Design. Key patterns covered:
- Customer booking list → `bookings(customer_id, status)`
- Provider job queue → `bookings(provider_id, scheduled_at)`
- Catalog browsing → `services(category_id, is_active)` + `provider_services(service_id)`
- Notification badge count → composite `notifications(user_id, is_read)`
- Coupon per-user enforcement → composite `coupon_usages(coupon_id, user_id)`

### Denormalized Aggregates
`provider_profiles.avg_rating`, `total_reviews`, and `total_bookings` are maintained by the service layer. Public catalog reads never execute `AVG()` or `COUNT()` on review data — the aggregation runs once per write event, not on every read.

### Pagination on All Collections
Every list endpoint accepts `?page=` and `?limit=` parameters. The database never returns unbounded result sets. All collection responses include the pagination metadata block.

### Singleton PrismaClient
`PrismaClient` is instantiated once as a singleton in `src/config/prisma.js` and shared across all module services. Multiple `new PrismaClient()` instantiations would exhaust the connection pool under load.

### Atomic Operations Prevent Lock Escalation
Wallet and coupon operations use Prisma's atomic `increment`/`decrement` instead of SELECT + UPDATE patterns. This reduces transaction duration and minimizes row-level lock contention under concurrent load.

---

## 19. Known Limitations

- **No payment gateway integration.** The `payments` table is fully schema-complete — it supports multiple attempts, stores the raw gateway JSON response, and tracks `paidAt`. However, live card/UPI processing via Razorpay, Stripe, or similar is not implemented. Wallet top-up is not exposed as a real payment flow.

- **No real-time notifications.** Notifications are persisted in the `notifications` table and must be retrieved via HTTP polling. WebSocket or Server-Sent Events delivery is not implemented.

- **OTP flows are schema-complete, not endpoint-complete.** The `otp_verifications` table is fully designed with expiry, purpose enum, and replay-prevention `is_used` flag. OTP generation, delivery (email/SMS), and verification HTTP endpoints are not yet implemented.

- **Local filesystem storage for uploads.** Provider documents are stored under `uploads/`. Production deployments require replacement with S3-compatible object storage (AWS S3, Cloudflare R2, Supabase Storage).

- **No coupon management API.** Coupons are fully modeled and enforced atomically during booking creation, but admin CRUD endpoints for creating and managing coupon codes are not implemented.

- **Provider discovery is proximity-unaware.** The catalog endpoint returns all available providers for a service regardless of location, even though `addresses` stores `Decimal(10,7)` lat/lng coordinates suitable for geospatial radius filtering.

- **No background job runner.** Expired OTP cleanup, coupon status deactivation, and scheduled notification delivery require a job queue (BullMQ, pg-boss) that is not yet integrated.

---

## 19. Future Improvements

- **Geospatial provider discovery** — PostGIS extension to filter providers by proximity to the customer's address pincode or coordinates
- **Payment gateway integration** — Razorpay or Stripe for real wallet top-up and direct booking payment flows
- **Real-time notifications** — Socket.IO or native Server-Sent Events for live booking and payment events
- **OTP authentication flows** — complete the email/phone verification and password reset pipeline
- **Cloud file storage** — replace local `uploads/` with an S3-compatible provider; add file type/size validation
- **Background job runner** — BullMQ or pg-boss for OTP expiry, coupon deactivation, and notification scheduling
- **Admin reporting API** — booking analytics, revenue summaries, and provider performance dashboards
- **Coupon management API** — admin endpoints for creating, editing, and deactivating coupon codes
- **Search and filtering** — full-text search on service names and categories; provider filtering by rating, experience, and verified status

---

## 20. Contributing

```bash
# Fork the repository, then:
git checkout -b feature/your-feature-name

# Make your changes, then:
npm run lint        # Must pass — zero warnings
npm run format      # Auto-format with Prettier

git commit -m "feat: describe your change concisely"
git push origin feature/your-feature-name
# Open a pull request
```

PRs with lint errors will not be merged. All new API endpoints must include validation schemas and Swagger JSDoc annotations.

---

## 21. Continuous Integration

ServiceHub utilizes a robust **GitHub Actions** CI pipeline to ensure zero-regression deployments and maintain high codebase quality. The pipeline automatically triggers on every `push` and `pull_request` to the `main` branch.

### Workflow Pipeline
The pipeline runs on `ubuntu-latest` and executes the following steps synchronously:
1. **Repository Checkout:** Pulls the latest code.
2. **Node.js Setup:** Installs Node.js v18 and caches `npm` modules.
3. **Database Spin-up:** Boots an isolated PostgreSQL service container (`postgres:15-alpine`) natively within the runner.
4. **Dependency Installation:** Runs a clean `npm ci`.
5. **Prisma Generation & Migration:** Compiles the Prisma Client and applies database migrations to the isolated CI database.
6. **Linting Check:** Executes ESLint to verify codebase hygiene.
7. **Integration Tests:** Runs the full Jest & Supertest integration suite (19/19 tests) against the temporary CI database schema.
8. **Docker Validation:** Performs a `docker build` of the multi-stage Dockerfile to verify the production image builds successfully.

The workflow fails immediately if any step returns a non-zero exit code.

### Required GitHub Secrets
To pass the CI tests (which require authentication keys to boot up the application), you must configure the following **Repository Secrets** in your GitHub project settings (`Settings > Secrets and variables > Actions`):

- `JWT_ACCESS_SECRET` - Used to sign access tokens during integration tests.
- `JWT_REFRESH_SECRET` - Used to sign refresh tokens during integration tests.

*Note: `DATABASE_URL` is purposely excluded from GitHub Secrets in the CI environment because the pipeline spins up a self-contained ephemeral PostgreSQL service container on `localhost:5432` to maximize isolation and prevent concurrent test suites from wiping an external staging database.*

### Local Verification
You can simulate the exact CI test suite locally by running:
```bash
npm run lint
npm run test # Ensure your local .env DATABASE_URL points to a test_schema!
docker build -t servicehub-api:ci .
```

### Troubleshooting
- **Tests Failing in CI but passing locally:** The CI uses an empty PostgreSQL container and runs migrations fresh. If it fails in CI, you may have uncommitted Prisma migrations, or you are relying on dirty data seeded in your local development database.
- **Docker Build Fails in CI:** Ensure all newly added packages are present in `package.json` and `package-lock.json` since the workflow strictly uses `npm ci`.

---

## 22. Docker Deployment

ServiceHub includes a production-grade Docker setup for reproducible, secure, and isolated deployments. The configuration uses a multi-stage Dockerfile that minimizes image size by excluding development dependencies and caches the Prisma query engine effectively. The application listens on **port 3000** in all environments — this is consistent across `Dockerfile`, `docker-compose.yml`, and `env.js`.

### Docker Prerequisites
- Docker Engine installed and running
- Docker Compose (optional, for local development orchestration)
- Environment variables configured in `.env`

### Building the Docker Image
```bash
docker build -t servicehub-api:latest .
```

### Running the Container (Standalone)
```bash
docker run -d \
  -p 3000:3000 \
  --name servicehub-api \
  --env-file .env \
  servicehub-api:latest
```

### Running with Docker Compose (Recommended for Development)
```bash
# Starts the API container with healthcheck, mounts uploads/logs directories
docker-compose up -d --build

# Check container health status
docker inspect --format='{{.State.Health.Status}}' servicehub-api
```

The container includes an automatic healthcheck that polls `GET /api/v1/health` every 30 seconds. Docker will automatically restart the container if it fails 3 consecutive health checks.

### Troubleshooting
- **Database Connection:** Ensure your `DATABASE_URL` in `.env` is accessible from within the container (e.g., if using a local Postgres database, you may need to use `host.docker.internal` instead of `localhost`). Since ServiceHub uses Neon PostgreSQL, the cloud URL should work seamlessly.
- **Port Conflicts:** If port 3000 is occupied, you can change the mapping in `docker-compose.yml` or the `docker run` command (e.g., `-p 8080:3000`).
- **Container Status:** Run `docker logs servicehub-api` to inspect startup logs and verify Prisma connected successfully.

---

## 23. Microsoft Azure Deployment

ServiceHub is configured for zero-downtime deployment to **Azure App Service (Web App for Containers)**. This is the recommended Azure production option as it natively supports Docker containers, abstracts server maintenance, and handles HTTPS termination seamlessly.

### Prerequisites
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed (`az`)
- A Docker Hub or Azure Container Registry (ACR) account containing your pushed `servicehub-api:latest` image
- An active Microsoft Azure Subscription

### Deployment Steps (via Azure CLI)

**1. Create a Resource Group**
```bash
az group create --name ServiceHub-RG --location eastus
```

**2. Create a Linux App Service Plan**
```bash
az appservice plan create --name ServiceHub-Plan --resource-group ServiceHub-RG --sku B1 --is-linux
```

**3. Deploy the Containerized Application**
```bash
# Replace <YOUR_APP_NAME> with a globally unique name
az webapp create --resource-group ServiceHub-RG --plan ServiceHub-Plan \
  --name <YOUR_APP_NAME> \
  --deployment-container-image-name yourdockerhub/servicehub-api:latest
```

### Environment Variable Configuration
Azure App Service requires environment variables to be injected via Application Settings. **Do not hardcode secrets in your Docker image.**

```bash
az webapp config appsettings set --resource-group ServiceHub-RG --name <YOUR_APP_NAME> --settings \
  DATABASE_URL="postgresql://user:password@ep-your-db.us-east-2.aws.neon.tech/servicehub?sslmode=require" \
  PORT=3000 \
  NODE_ENV="production" \
  JWT_ACCESS_SECRET="your_secure_access_secret" \
  JWT_REFRESH_SECRET="your_secure_refresh_secret" \
  WEBSITES_PORT=3000
```
*Note: `WEBSITES_PORT=3000` is critical. It instructs Azure App Service to route incoming HTTP traffic to port 3000 inside the Docker container.*

### Verification Steps
Once the deployment finishes and the container spins up:
1. Navigate to `https://<YOUR_APP_NAME>.azurewebsites.net/api/v1/health` to verify the application has started and the database connection to Neon PostgreSQL is healthy.
2. Navigate to `https://<YOUR_APP_NAME>.azurewebsites.net/api-docs` to ensure Swagger UI loads correctly.
3. Attempt to log in or create a user to verify `JWT` secrets are actively signing tokens.

### Troubleshooting
- **Container Fails to Start:** Check the container logs using the Azure CLI: `az webapp log tail --name <YOUR_APP_NAME> --resource-group ServiceHub-RG`.
- **Database Connection Refused:** Verify that your Neon PostgreSQL IP Allowlist is configured to allow Azure IPs, or is open to all IPs (`0.0.0.0/0`) if required. Ensure `sslmode=require` is present in the `DATABASE_URL`.
- **Prisma Errors:** The Dockerfile automatically runs `npx prisma generate` during the build stage. If Prisma complains about a missing engine, ensure you deployed the multi-stage image.

---

## 24. License

**ISC License**

Copyright © 2026 ServiceHub Engineering

Permission to use, copy, modify, and distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

---

<div align="center">

**ServiceHub API v1.0.0**

PostgreSQL · Prisma ORM · Express · OpenAPI 3.0.3

28 tables · 17 enums · 43 endpoints · Production-ready

</div>

---

## 25. Resume Points

- **Architected and implemented a zero-leakage integration testing suite** for a Node.js/PostgreSQL microservices backend using Jest and Supertest, executing 100% of 19 end-to-end critical paths against a completely isolated database schema; enforced strict singleton connection pooling and atomic \TRUNCATE CASCADE\ lifecycle hooks, eliminating flaky tests and guaranteeing state isolation.

- **Containerized the backend using Docker**, creating a reproducible deployment environment with a multi-stage build, optimized layer caching, and a secure non-root runtime isolation suitable for production deployment.
- **Containerized and deployed a production-grade Node.js backend on Microsoft Azure** using Docker with secure environment-based configuration and external Neon PostgreSQL integration.
- **Implemented a GitHub Actions CI pipeline** to automate dependency installation, linting, full integration testing within ephemeral PostgreSQL service containers, Prisma client generation, and Docker image validation for zero-regression deployment confidence.
