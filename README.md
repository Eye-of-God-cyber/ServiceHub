<div align="center">

# ServiceHub API

**Multi-Vendor Home Services Marketplace — REST API**

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-6BA539?logo=swagger&logoColor=white)](http://localhost:5000/api-docs)
[![License](https://img.shields.io/badge/License-ISC-blue)](LICENSE)

A production-grade REST API for a multi-vendor home services marketplace. Customers discover and book services (plumbing, electrical, cleaning, etc.). Providers manage availability, pricing, and their job queue. Admins oversee document verification, booking oversight, and dispute resolution.

**Built to demonstrate:** PostgreSQL database engineering · Prisma ORM · REST API design · JWT authentication · Role-based access control · Backend security patterns

</div>

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Database Design](#2-database-design)
3. [API Reference](#3-api-reference)
4. [Backend Features](#4-backend-features)
5. [Security](#5-security)
6. [Project Structure](#6-project-structure)
7. [Setup Guide](#7-setup-guide)
8. [API Documentation — Swagger](#8-api-documentation--swagger)
9. [Sample API Flow](#9-sample-api-flow)
10. [Deployment](#10-deployment)
11. [Known Limitations](#11-known-limitations)

---

## 1. System Architecture

ServiceHub follows a layered MVC-like architecture with strict separation of concerns.

```
┌───────────────────────────────────────────────────────┐
│                     HTTP Request                      │
└───────────────────────────┬───────────────────────────┘
                            │
                   ┌────────▼────────┐
                   │  Middleware      │
                   │  Pipeline (app) │
                   └────────┬────────┘
                            │
        ┌───────────────────▼────────────────────┐
        │       Express Router (routes/)          │
        │  Dispatches to the correct module       │
        └───────────────────┬────────────────────┘
                            │
        ┌───────────────────▼────────────────────┐
        │     Auth + Role Middleware              │
        │  JWT verification, RBAC enforcement    │
        └───────────────────┬────────────────────┘
                            │
        ┌───────────────────▼────────────────────┐
        │     Validation Middleware               │
        │  express-validator schemas per route   │
        └───────────────────┬────────────────────┘
                            │
        ┌───────────────────▼────────────────────┐
        │        Controller (thin)                │
        │  Extracts request → calls service →    │
        │  sends ApiResponse                     │
        └───────────────────┬────────────────────┘
                            │
        ┌───────────────────▼────────────────────┐
        │    Service Layer (business logic)       │
        │  Transactions, Prisma queries,         │
        │  domain rules, error throwing          │
        └───────────────────┬────────────────────┘
                            │
        ┌───────────────────▼────────────────────┐
        │     Prisma ORM → PostgreSQL             │
        └────────────────────────────────────────┘
```

### Middleware Pipeline (in order)

| Layer | Purpose |
|-------|---------|
| `helmet` | Sets ~14 security HTTP headers (CSP, HSTS, X-Frame-Options, etc.) |
| `cors` | Restricts cross-origin access to configured allowlist |
| `express.json` | Parses JSON bodies; capped at 10 KB to prevent payload attacks |
| `hpp` | Prevents HTTP Parameter Pollution attacks |
| `morgan` | Structured HTTP access logging |
| `globalLimiter` | Rate limits all `/api` routes (100 req / 15 min by default) |
| `auth.middleware` | Verifies JWT, loads user + roles, checks account status |
| `role.middleware` | Enforces required roles per route group |
| `express-validator` | Per-route field validation schemas |
| `validate` | Collects validation errors → throws `AppError(400)` with field-level messages |
| `errorHandler` | Catches `AppError` and unexpected exceptions; returns standard JSON |

---

## 2. Database Design

### Overview

| Property | Value |
|----------|-------|
| Database | PostgreSQL 16 |
| ORM | Prisma 5.x |
| Tables | **28** |
| Enums | **17** |
| Normalization | 3NF with selective denormalization for performance |
| User PK Strategy | UUID (prevents sequential ID enumeration attacks) |
| Other PKs | Auto-increment integers (lighter joins, simpler foreign keys) |
| Monetary Fields | `Decimal(10,2)` — exact arithmetic, no floating-point rounding |

### Table Inventory

| Table | Description |
|-------|-------------|
| `roles` | Master role list: CUSTOMER, PROVIDER, ADMIN |
| `users` | Authentication identity — UUID PK, bcrypt password hash, account status |
| `user_roles` | Many-to-many junction: user ↔ role assignment with timestamp |
| `user_profiles` | Customer display names, avatars, date of birth |
| `provider_profiles` | Bio, experience years, verification status, avg_rating, total_bookings |
| `provider_documents` | Verification file uploads with per-document PENDING/APPROVED/REJECTED status |
| `provider_availability` | Recurring weekly schedule — one row per day of week per provider |
| `provider_time_off` | Date-range exceptions to the weekly schedule (vacations, sick days) |
| `provider_services` | Junction: provider ↔ service, with optional custom pricing override |
| `service_categories` | Top-level groupings: Plumbing, Electrical, Cleaning, etc. |
| `services` | Admin-defined service catalog with base prices and pricing units |
| `addresses` | Customer saved addresses; `Decimal(10,7)` lat/lng for ~1 cm geospatial precision |
| `bookings` | **Core fact table** — links customer, provider, service, address, coupon with immutable price snapshot |
| `booking_status_history` | Append-only audit trail of every booking status transition with actor |
| `payments` | Payment attempts per booking (multiple retries supported), gateway response stored as JSON |
| `wallets` | Running balance per user — denormalized from `wallet_transactions` for performance |
| `wallet_transactions` | Immutable append-only financial ledger with balance_before/after snapshots |
| `reviews` | 1:1 per completed booking; integer rating 1–5 driving provider aggregate metrics |
| `review_replies` | Provider response to a customer review (1:1 with review) |
| `disputes` | Support ticket raised against a booking — threaded via `dispute_messages` |
| `dispute_messages` | Chronological message thread within a dispute |
| `notifications` | In-app notification feed; typed enum drives icon and deep-link behavior |
| `coupons` | Admin discount codes: PERCENTAGE or FLAT, with per-user usage limits |
| `coupon_usages` | Tracks coupon ↔ user ↔ booking redemption for per-user limit enforcement |
| `otp_verifications` | Short-lived OTP codes for email/phone verification and password reset |

### Entity-Relationship Summary

```
users ──────────────────────────────┬── user_profiles         (1:1)
  │                                 ├── provider_profiles      (1:1)
  │                                 │     ├── provider_services      (1:N)
  │                                 │     ├── provider_availability  (1:N)
  │                                 │     ├── provider_time_off      (1:N)
  │                                 │     └── provider_documents     (1:N)
  │                                 ├── wallets                (1:1)
  │                                 │     └── wallet_transactions    (1:N, immutable)
  │                                 ├── addresses              (1:N)
  │                                 ├── bookings               (1:N, as customer)
  │                                 ├── notifications          (1:N)
  │                                 ├── disputes               (1:N)
  │                                 └── coupon_usages          (1:N)
  │
bookings ───────────────────────────┬── booking_status_history (1:N, append-only)
  │                                 ├── payments               (1:N, multiple attempts)
  │                                 ├── wallet_transactions    (1:N)
  │                                 ├── reviews                (1:1)
  │                                 ├── disputes               (1:N)
  │                                 └── coupon_usages          (1:1)

service_categories ─────────────────── services (1:N) ─── provider_services (1:N)
coupons ────────────────────────────── coupon_usages (1:N)
```

### Key Engineering Decisions

**UUID primary keys for `users`**
Sequential integer IDs expose total user count and allow trivial account enumeration (`/users/1`, `/users/2`). UUIDs prevent this at zero application-code cost.

**Immutable ledger tables**
`wallet_transactions` and `booking_status_history` have **no `updatedAt` field** by design. Rows are insert-only and must never be modified. Each `wallet_transactions` row captures `balance_before` and `balance_after` to support point-in-time balance reconstruction without replaying the full ledger.

**Denormalized aggregates**
`provider_profiles.avg_rating` and `total_reviews` avoid expensive `COUNT()` / `AVG()` aggregations on every catalog call. Updated atomically in the same Prisma transaction as review creation, so they are always consistent.

**Atomic concurrent-safe wallet and coupon operations**
Wallet debits and coupon usage counts use Prisma `increment`/`decrement` inside transactions. The constraint check (balance ≥ 0, usageCount ≤ maxUsage) runs **after** the atomic increment — not before — to eliminate the TOCTOU window that would exist in a read-then-write approach.

**Explicit cascade behaviors**

| Behavior | Rationale |
|----------|-----------|
| `Cascade` | Child rows have no meaning without their parent (e.g., `user_profiles → users`) |
| `Restrict` | Protect financial and audit records from accidental deletion (bookings, payments) |
| `SetNull` | Preserve audit trail even when the actor user is later removed (`booking_status_history.changed_by_id`) |

**Decimal(10,2) for money**
Matches SQL `NUMERIC` semantics. Avoids IEEE 754 floating-point rounding errors that appear with JavaScript `number` or PostgreSQL `float8`.

### Key Indexes

```sql
-- Provider discovery
CREATE INDEX ON provider_profiles (verification_status);
CREATE INDEX ON provider_profiles (is_available);
CREATE INDEX ON provider_services (provider_id);
CREATE INDEX ON provider_services (service_id);

-- Catalog browsing
CREATE INDEX ON services (category_id);
CREATE INDEX ON services (is_active);
CREATE INDEX ON service_categories (is_active);

-- Customer queries
CREATE INDEX ON addresses (user_id);
CREATE INDEX ON addresses (pincode);

-- Booking queries
CREATE INDEX ON bookings (customer_id);
CREATE INDEX ON bookings (provider_id);
CREATE INDEX ON bookings (status);
CREATE INDEX ON bookings (scheduled_at);
CREATE INDEX ON booking_status_history (booking_id);

-- Financial queries
CREATE INDEX ON wallet_transactions (wallet_id);
CREATE INDEX ON wallet_transactions (status);
CREATE INDEX ON payments (booking_id);
CREATE INDEX ON payments (status);

-- Support & notifications
CREATE INDEX ON disputes (booking_id);
CREATE INDEX ON disputes (raised_by_id);
CREATE INDEX ON disputes (status);
CREATE INDEX ON notifications (user_id);
CREATE INDEX ON notifications (user_id, is_read);  -- unread badge count
CREATE INDEX ON dispute_messages (dispute_id);

-- Coupon enforcement
CREATE INDEX ON coupon_usages (coupon_id, user_id);  -- per-user limit check
CREATE INDEX ON coupons (status);
```

---

## 3. API Reference

**Base URL:** `http://localhost:5000/api/v1`

All protected routes require:
```
Authorization: Bearer <access_token>
```

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | Public | Register as CUSTOMER or PROVIDER |
| `POST` | `/auth/login` | Public | Login — returns access + refresh tokens |
| `GET` | `/auth/me` | Any | Get current authenticated user's profile |

### Users (Customer Profile & Addresses)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/users/addresses` | CUSTOMER | List all saved addresses |
| `POST` | `/users/addresses` | CUSTOMER | Add a new address |
| `PUT` | `/users/addresses/:id` | CUSTOMER | Update an address |
| `DELETE` | `/users/addresses/:id` | CUSTOMER | Delete an address |
| `PATCH` | `/users/addresses/:id/default` | CUSTOMER | Set an address as default |

### Providers

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/providers/me` | PROVIDER | Get own provider profile |
| `PUT` | `/providers/me` | PROVIDER | Update profile bio and availability flag |
| `GET` | `/providers/me/documents` | PROVIDER | List uploaded verification documents |
| `POST` | `/providers/me/documents` | PROVIDER | Upload a verification document |
| `DELETE` | `/providers/me/documents/:id` | PROVIDER | Delete a document |
| `GET` | `/providers/me/availability` | PROVIDER | Get weekly availability schedule |
| `PUT` | `/providers/me/availability` | PROVIDER | Upsert weekly time slots |
| `GET` | `/providers/me/time-off` | PROVIDER | List time-off date ranges |
| `POST` | `/providers/me/time-off` | PROVIDER | Create a time-off period |
| `DELETE` | `/providers/me/time-off/:id` | PROVIDER | Delete a time-off period |
| `GET` | `/providers/me/services` | PROVIDER | List offered services |
| `POST` | `/providers/me/services` | PROVIDER | Add a service to offerings |
| `PUT` | `/providers/me/services/:id` | PROVIDER | Update a service offering |
| `DELETE` | `/providers/me/services/:id` | PROVIDER | Remove a service from offerings |

### Catalog

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/catalog/categories` | Public | List all active service categories |
| `GET` | `/catalog/services` | Public | Browse services (`?categoryId=`, `?isActive=`) |
| `GET` | `/catalog/services/:id` | Public | Get service detail + available providers |

### Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/bookings` | CUSTOMER | Create a new booking |
| `GET` | `/bookings` | Any | List bookings for authenticated user (`?status=`) |
| `GET` | `/bookings/:id` | Any | Get booking detail |
| `PATCH` | `/bookings/:id/status` | Any | Update booking status (state machine enforced) |

**Valid status transitions (enforced server-side):**
```
PENDING    → CONFIRMED    (PROVIDER confirms the job)
PENDING    → CANCELLED    (CUSTOMER or PROVIDER cancels)
CONFIRMED  → IN_PROGRESS  (PROVIDER starts the job)
CONFIRMED  → CANCELLED    (CUSTOMER or PROVIDER cancels)
IN_PROGRESS → COMPLETED   (PROVIDER marks complete)
IN_PROGRESS → NO_SHOW     (PROVIDER marks customer no-show)
```

### Wallet

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/wallets/me` | Any | Get wallet balance + paginated transaction history |

### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/reviews` | Any | List reviews (`?providerId=`, `?minRating=`) |
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
| `GET` | `/disputes` | Any | List disputes for authenticated user |
| `GET` | `/disputes/:id` | Any | Get dispute detail with full message thread |
| `POST` | `/disputes/:id/messages` | Any | Send a message in a dispute thread |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `PATCH` | `/admin/documents/:id/status` | ADMIN | Approve or reject a provider document |
| `PATCH` | `/admin/disputes/:id/resolve` | ADMIN | Resolve a dispute with a resolution note |

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | Public | Health check — returns uptime and environment |

---

## 4. Backend Features

### JWT Authentication

- Access tokens (HS256, configurable expiry — default 15 minutes)
- Refresh tokens (separate secret, default 7 days)
- Timing-attack-safe login: `bcrypt.compare()` always runs even for unknown emails (dummy hash fallback prevents response-time enumeration)
- Account status checked on every authenticated request (`ACTIVE` / `INACTIVE` / `SUSPENDED` / `BANNED`)

### Role-Based Access Control (RBAC)

- Three roles: `CUSTOMER`, `PROVIDER`, `ADMIN`
- A single user can hold multiple roles simultaneously (e.g., a customer who is also a provider)
- Role assignments stored in `user_roles` junction table with timestamps
- `role.middleware` enforces per-route role requirements; controllers never re-check roles

### Input Validation

- All routes use [`express-validator`](https://express-validator.github.io/docs/) schemas defined in `src/validations/`
- Validation schemas are isolated from business logic and route definitions
- Shared `validate` middleware collects all field errors and throws a structured `AppError(400)` with per-field messages
- Immutable fields (`verificationStatus`, `avgRating`, `role`) are hard-blocked with `.not().exists()` — clients receive explicit errors rather than silent ignores

### Structured Logging

- **Winston** for application logging with `info`, `warn`, `error`, `debug` levels
- **Morgan** for HTTP request logging (method, path, status code, response time)
- **winston-daily-rotate-file** writes rotating daily log files to `logs/`
- All log entries are JSON-structured for ingestion by log aggregators (Datadog, Logtail, etc.)

### Pagination

All collection endpoints support consistent offset pagination:

```json
{
  "data": [ ... ],
  "pagination": {
    "total": 150,
    "page": 2,
    "limit": 20,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": true
  }
}
```

### Standardized API Responses

Every response uses the `ApiResponse` utility for a consistent envelope:

**Success:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": { ... }
}
```

**Validation error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "scheduledAt", "message": "Must be a future date" }
  ]
}
```

### Database Transactions

All multi-step writes use Prisma transactions for atomicity:

| Operation | Transactional Steps |
|-----------|-------------------|
| Booking creation | Create booking + `BookingStatusHistory` entry + debit wallet + `WalletTransaction` + apply coupon |
| Status update | Update booking status + append `BookingStatusHistory` row |
| Review submission | Create review + update `provider_profiles.avg_rating` + `total_reviews` |
| Wallet debit | Atomic `increment` → check result → rollback if insufficient |
| Coupon application | Atomic `increment usageCount` → check against `maxUsage` → rollback if exceeded |

### Rate Limiting

| Limiter | Scope | Default Limit |
|---------|-------|---------------|
| `globalLimiter` | All `/api` routes | 100 req / 15 min |
| Auth limiter | `/auth/login`, `/auth/register` | Stricter (configurable) |

### XSS Sanitization

Plain-text input fields pass through `sanitizePlainText()` which strips HTML tags without double-encoding. This prevents injection vectors while avoiding data corruption for API clients that pass raw text.

---

## 5. Security

| Threat | Mitigation |
|--------|-----------|
| Brute-force login | Rate limiter on auth routes + bcrypt (12 rounds) |
| User enumeration via IDs | UUID primary keys for `users` table |
| Timing attacks on login | `bcrypt.compare()` always runs — dummy hash used for unknown emails |
| JWT tampering | HS256 with separate secrets for access and refresh tokens |
| Privilege escalation | `role.middleware` enforces RBAC on every protected route |
| XSS via stored input | `sanitizePlainText()` strips HTML from all text inputs |
| Mass assignment | `express-validator` schemas block all undeclared fields |
| Payload bombs | `express.json({ limit: '10kb' })` caps request body size |
| CORS abuse | Allowlist-only CORS configuration |
| Clickjacking / header attacks | `helmet` sets X-Frame-Options, Content-Security-Policy, HSTS, etc. |
| HTTP Parameter Pollution | `hpp` middleware deduplicates query parameters |
| SQL injection | All DB access via Prisma parameterized queries — zero raw SQL |
| Wallet race conditions | Atomic `increment`/`decrement` in transactions — no TOCTOU window |
| Coupon race conditions | `usageCount` incremented atomically; checked **after** increment |
| Password storage | bcrypt with configurable salt rounds (default: 12) — never stored in plaintext |

---

## 6. Project Structure

```
ServiceHub/
├── server.js                    # Process entry point, HTTP server, graceful shutdown
├── prisma/
│   ├── schema.prisma             # Full PostgreSQL schema (28 tables, 17 enums, ~1,255 lines)
│   ├── seed.js                   # Comprehensive seed script
│   └── migrations/               # Prisma migration history
├── src/
│   ├── app.js                    # Express factory — middleware pipeline, route mounting
│   ├── config/
│   │   ├── env.js                # Centralized environment variable loading
│   │   ├── prisma.js             # Shared PrismaClient singleton
│   │   ├── swagger.js            # swagger-jsdoc configuration (OpenAPI 3.0.3)
│   │   └── jwt.constants.js      # JWT secret and expiry constants
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT verification + user status check + role loading
│   │   ├── role.middleware.js    # RBAC enforcement per route
│   │   ├── validate.js           # express-validator error collector → AppError
│   │   ├── rateLimiter.js        # Global + auth-specific rate limiters
│   │   ├── requestLogger.js      # Morgan HTTP access logger
│   │   └── errorHandler.js       # Global error handler + 404 handler
│   ├── routes/
│   │   └── index.js              # Central route registry — mounts all module routers
│   ├── modules/
│   │   ├── auth/                 # register · login · /me
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.routes.js
│   │   ├── users/                # profile · addresses (CRUD + default)
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   └── user.routes.js
│   │   ├── providers/            # profile · documents · availability · time-off · services
│   │   │   ├── provider.controller.js
│   │   │   ├── provider.service.js
│   │   │   └── provider.routes.js
│   │   ├── catalog/              # categories · services · service detail with providers
│   │   │   ├── catalog.controller.js
│   │   │   ├── catalog.service.js
│   │   │   └── catalog.routes.js
│   │   ├── bookings/             # create · list · detail · status update (state machine)
│   │   │   ├── booking.controller.js
│   │   │   ├── booking.service.js
│   │   │   └── booking.routes.js
│   │   ├── wallets/              # balance + transaction history
│   │   │   ├── wallet.controller.js
│   │   │   ├── wallet.service.js
│   │   │   └── wallet.routes.js
│   │   ├── reviews/              # list · create · provider reply
│   │   │   ├── review.controller.js
│   │   │   ├── review.service.js
│   │   │   └── review.routes.js
│   │   ├── notifications/        # list · mark read · mark all read
│   │   │   ├── notification.controller.js
│   │   │   ├── notification.service.js
│   │   │   └── notification.routes.js
│   │   ├── disputes/             # open · list · detail · send message
│   │   │   ├── dispute.controller.js
│   │   │   ├── dispute.service.js
│   │   │   └── dispute.routes.js
│   │   ├── admin/                # document status · dispute resolution
│   │   │   ├── admin.controller.js
│   │   │   ├── admin.service.js
│   │   │   └── admin.routes.js
│   │   └── health/               # health check
│   │       ├── health.controller.js
│   │       └── health.routes.js
│   ├── validations/              # express-validator schemas (one file per module)
│   │   ├── auth.validation.js
│   │   ├── booking.validation.js
│   │   ├── bookingStatus.validation.js
│   │   ├── dispute.validation.js
│   │   ├── provider.validation.js
│   │   └── review.validation.js
│   ├── utils/
│   │   ├── ApiResponse.js        # Standardized success/error response envelope
│   │   ├── AppError.js           # Custom error class (statusCode, message, errors[])
│   │   ├── jwt.util.js           # Token sign and verify helpers
│   │   ├── password.util.js      # bcrypt hash and compare wrappers
│   │   ├── pagination.util.js    # getPaginationOptions + formatPaginatedResponse
│   │   ├── sanitize.util.js      # sanitizePlainText — strips HTML from text fields
│   │   └── logger.js             # Winston logger configuration
│   └── errors/                   # Domain-specific error types
├── uploads/                      # Provider document file uploads
├── logs/                         # Winston daily-rotated log files
├── nodemon.json                  # nodemon watch configuration
├── .env.example                  # Environment variable reference
└── package.json
```

---

## 7. Setup Guide

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | ≥ 18.0.0 |
| npm | ≥ 9.0.0 |
| PostgreSQL | ≥ 14 |

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ServiceHub.git
cd ServiceHub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/servicehub_db?schema=public"

# JWT — use ≥ 64 character random strings in production
JWT_SECRET=your_access_token_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_token_secret_here
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MINUTES=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# File Uploads
MAX_FILE_SIZE_BYTES=5242880
UPLOAD_DIR=uploads

# Security
BCRYPT_SALT_ROUNDS=12
```

### 4. Create the Database

```bash
psql -U postgres -c "CREATE DATABASE servicehub_db;"
```

### 5. Run Prisma Migrations

```bash
npm run prisma:migrate
```

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Seed the Database

```bash
npm run seed
```

| Entity | Count |
|--------|-------|
| Users | 15 (1 admin, 8 customers, 6 providers) |
| Service categories | 8 |
| Services | 32 |
| Provider service offerings | 36 |
| Bookings | 38 (past, present, future) |
| Reviews | 12 |
| Disputes | 8 |
| Notifications | 230 |
| Wallets | 15 |
| Coupons | 7 |

**All seed account passwords:** `Password@123`

| Role | Email |
|------|-------|
| Admin | `admin@servicehub.app` |
| Customer | `amit.gupta@gmail.com` |
| Provider | `rajesh.kumar@gmail.com` |

### 8. Start the Server

```bash
npm run dev
```

| URL | Purpose |
|-----|---------|
| `http://localhost:5000/api/v1/health` | Health check |
| `http://localhost:5000/api-docs` | Swagger UI |
| `http://localhost:5000/api-docs.json` | Raw OpenAPI JSON |

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon hot-reload |
| `npm start` | Start production server |
| `npm run seed` | Seed the database |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npm run prisma:migrate` | Run migrations (dev) |
| `npm run prisma:migrate:prod` | Deploy migrations (production) |
| `npm run prisma:studio` | Open Prisma Studio (database GUI) |
| `npm run prisma:reset` | ⚠ Reset + re-migrate (destructive) |

---

## 8. API Documentation — Swagger

ServiceHub exposes a full interactive OpenAPI 3.0.3 specification.

**Swagger UI:** `http://localhost:5000/api-docs`

**Raw OpenAPI JSON:** `http://localhost:5000/api-docs.json`

Features:
- **JWT Authorize** button — enter your access token once; all subsequent requests are authenticated
- `persistAuthorization: true` — token survives browser refreshes
- Every endpoint documents: summary, description, parameters, request body schema, response schemas, and HTTP status codes
- Reusable response components: `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ValidationError`

| Tag | Endpoints |
|-----|-----------|
| Auth | 3 |
| Users | 5 |
| Providers | 14 |
| Catalog | 3 |
| Bookings | 4 |
| Wallet | 1 |
| Reviews | 3 |
| Notifications | 3 |
| Disputes | 4 |
| Admin | 2 |
| Health | 1 |
| **Total** | **43** |

---

## 9. Sample API Flow

### Customer Books a Service

```bash
# 1. Register
POST /api/v1/auth/register
{
  "email": "customer@example.com",
  "phone": "9876543210",
  "password": "SecurePass@123",
  "firstName": "Rahul",
  "lastName": "Sharma",
  "role": "CUSTOMER"
}

# 2. Login → receive tokens
POST /api/v1/auth/login
{
  "email": "customer@example.com",
  "password": "SecurePass@123"
}
# Response: { "data": { "accessToken": "...", "refreshToken": "..." } }

# 3. Browse service categories
GET /api/v1/catalog/categories

# 4. Browse services in a category
GET /api/v1/catalog/services?categoryId=1

# 5. View providers for a service
GET /api/v1/catalog/services/5

# 6. Add a service address
POST /api/v1/users/addresses
Authorization: Bearer <accessToken>
{
  "label": "Home",
  "line1": "42 MG Road",
  "city": "Bengaluru",
  "state": "Karnataka",
  "pincode": "560001"
}

# 7. Create booking
POST /api/v1/bookings
Authorization: Bearer <accessToken>
{
  "providerServiceId": 12,
  "addressId": 1,
  "scheduledAt": "2026-08-10T10:00:00.000Z",
  "notes": "Please bring your own tools"
}

# 8. Check booking status
GET /api/v1/bookings/1
Authorization: Bearer <accessToken>

# 9. Submit review after completion
POST /api/v1/reviews
Authorization: Bearer <accessToken>
{
  "bookingId": 1,
  "rating": 5,
  "comment": "Excellent service, arrived on time!"
}

# 10. Check wallet balance
GET /api/v1/wallets/me
Authorization: Bearer <accessToken>
```

### Provider Manages a Job

```bash
# 1. Login
POST /api/v1/auth/login
{ "email": "rajesh.kumar@gmail.com", "password": "Password@123" }

# 2. Confirm booking
PATCH /api/v1/bookings/1/status
Authorization: Bearer <accessToken>
{ "status": "CONFIRMED" }

# 3. Start job
PATCH /api/v1/bookings/1/status
{ "status": "IN_PROGRESS" }

# 4. Mark complete
PATCH /api/v1/bookings/1/status
{ "status": "COMPLETED" }

# 5. Reply to customer review
POST /api/v1/reviews/1/reply
{ "comment": "Thank you for the kind words!" }
```

### Admin Workflow

```bash
# 1. Login as admin
POST /api/v1/auth/login
{ "email": "admin@servicehub.app", "password": "Password@123" }

# 2. Approve a provider document
PATCH /api/v1/admin/documents/5/status
Authorization: Bearer <accessToken>
{ "status": "APPROVED", "adminNotes": "ID document verified successfully" }

# 3. Resolve a dispute
PATCH /api/v1/admin/disputes/2/resolve
Authorization: Bearer <accessToken>
{ "resolution": "Refund issued to customer — provider did not show up." }
```

---

## 10. Deployment

### Environment Variables for Production

```env
NODE_ENV=production
JWT_SECRET=<minimum 64 random characters — use openssl rand -base64 64>
JWT_REFRESH_SECRET=<different minimum 64 random characters>
DATABASE_URL=<production PostgreSQL connection string>
BCRYPT_SALT_ROUNDS=12
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
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: servicehub_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

```bash
# Start services
docker-compose up -d

# Apply migrations
docker-compose exec api npx prisma migrate deploy

# Seed (optional)
docker-compose exec api npm run seed
```

### Render

1. Create a new **Web Service** → connect GitHub repository
2. **Build Command:** `npm install && npx prisma generate`
3. **Start Command:** `node server.js`
4. Add a **PostgreSQL** database from Render's dashboard
5. Set `DATABASE_URL` from the Render database connection string
6. After first deploy, run `npx prisma migrate deploy` via the Render Shell

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
3. Add a **Database** component → PostgreSQL managed database
4. Set `DATABASE_URL` from the DO connection string
5. Add remaining environment variables in **App-Level Env Vars**
6. Run `npx prisma migrate deploy` via **Console** after first deploy

---

## 11. Known Limitations

- **No payment gateway integration.** The `payments` table and schema are fully designed, but actual card/UPI processing is simulated. Wallet top-up is not implemented as a real payment flow.

- **No real-time notifications.** Notifications are stored in the database and retrieved via polling. WebSocket or Server-Sent Events delivery is not implemented.

- **OTP flows are schema-complete but not exposed via HTTP.** The `otp_verifications` table is fully designed, but OTP generation, email/SMS delivery, and verification endpoints are not yet implemented.

- **Local file storage only.** Provider documents are stored on the local filesystem (`uploads/`). Production deployments should use S3-compatible object storage (AWS S3, Cloudflare R2, etc.).

- **Coupon HTTP endpoints not exposed.** Coupons are fully modeled in the database and can be applied during booking creation, but admin CRUD endpoints for managing coupon codes are not yet implemented.

- **Provider discovery is basic.** The catalog API returns all available providers for a service but does not filter by proximity, even though addresses store `Decimal(10,7)` latitude/longitude (~1 cm precision).

- **No background job runner.** Expired OTPs and expired coupons require manual cleanup. A cron job or queue worker (BullMQ, pg-boss) is the recommended next addition.

---

<div align="center">

**ServiceHub API v1.0.0** · PostgreSQL · Prisma · Express · OpenAPI 3.0

</div>
