<div align="center">

# ServiceHub API

### Production-Grade REST API — Multi-Vendor Home Services Marketplace

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)](https://neon.tech)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ED?logo=docker&logoColor=white)](https://www.docker.com)
[![Azure](https://img.shields.io/badge/Azure-App%20Service-0078D4?logo=microsoftazure&logoColor=white)](https://azure.microsoft.com)
[![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?logo=render&logoColor=white)](https://render.com)
[![GitHub Actions](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0.3-6BA539?logo=swagger&logoColor=white)](https://swagger.io)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

A production-ready, fully containerized REST API powering a multi-vendor home services marketplace. Deployed simultaneously on **Microsoft Azure** and **Render**, with a complete **GitHub Actions** CI pipeline, Prisma ORM, Neon PostgreSQL, JWT authentication, and interactive Swagger documentation.

[Live Demo (Azure)](#live-demo) · [Swagger UI](#api-documentation-swagger) · [Architecture](#architecture)

</div>

---

## Table of Contents

1. [Live Demo](#live-demo)
2. [Overview](#overview)
3. [Architecture](#architecture)
4. [Technology Stack](#technology-stack)
5. [Features](#features)
6. [Database Design](#database-design)
7. [API Reference](#api-reference)
8. [API Documentation (Swagger)](#api-documentation-swagger)
9. [Docker](#docker)
10. [Azure Deployment](#azure-deployment)
11. [Render Deployment](#render-deployment)
12. [CI/CD Pipeline](#cicd-pipeline)
13. [Testing](#testing)
14. [Security](#security)
15. [Project Structure](#project-structure)
16. [Installation](#installation)
17. [Environment Variables](#environment-variables)
18. [Performance Benchmarks](#performance-benchmarks)
19. [Production Highlights](#production-highlights)
20. [Known Limitations and Roadmap](#known-limitations-and-roadmap)
21. [Contributing](#contributing)
22. [License](#license)

---

## Live Demo

| Target | URL |
|--------|-----|
| **Backend API (Azure)** | `https://servicehub-api-niraj2026.azurewebsites.net/api/v1` |
| **Backend API (Render)** | `https://servicehub-api-13vx.onrender.com/api/v1` |
| **Swagger UI (Azure)** | `https://servicehub-api-niraj2026.azurewebsites.net/api-docs/` |
| **Swagger UI (Render)** | `https://servicehub-api-13vx.onrender.com/api-docs/` |
| **Health Endpoint (Azure)** | `https://servicehub-api-niraj2026.azurewebsites.net/api/v1/health` |
| **Health Endpoint (Render)** | `https://servicehub-api-13vx.onrender.com/api/v1/health` |

**Sample health response:**

```json
{
  "success": true,
  "message": "ServiceHub API is running",
  "data": {
    "status": "healthy",
    "database": "connected",
    "environment": "production",
    "timestamp": "2026-07-20T21:18:49.223Z",
    "uptime": 6
  }
}
```

---

## Overview

ServiceHub solves the discovery and trust problem in the home services industry.

### The Problem

- Unverified, hard-to-discover service professionals
- No standardized booking or payment flow
- No dispute resolution mechanism for customers
- No structured earnings management for providers

### The Solution

ServiceHub provides a structured platform where three roles operate independently:

- **Customers** browse a verified service catalog, book appointments at a saved address, pay through an integrated wallet, track job status in real time, and submit reviews.
- **Providers** manage their profile, upload verification documents, configure weekly availability, define service offerings with custom pricing, and accept or reject bookings.
- **Admins** approve provider verification documents, manage the service catalog, and resolve customer-provider disputes.

### Booking Lifecycle

```
Customer creates booking => PENDING
         |
         +-- Provider accepts => CONFIRMED
         |         |
         |         +-- Provider starts => IN_PROGRESS
         |         |         |
         |         |         +-- Provider completes => COMPLETED => Review + Earnings settled
         |         |         +-- Customer no-show  => NO_SHOW
         |         |
         |         +-- Either party cancels => CANCELLED
         |
         +-- Either party cancels => CANCELLED
```

Every status transition is recorded in an immutable `booking_status_history` audit table — preserving who triggered it, when, and why.

---

## Architecture

```mermaid
flowchart TD
    A["HTTP Client / Browser / Mobile App"] --> B["Azure App Service / Render"]
    B --> C["Middleware Pipeline\nhelmet / cors / json / hpp / morgan / rate-limit"]
    C --> D["Express Router"]
    D --> E["Auth and RBAC Middleware\nJWT / Account Status / Role Check"]
    E --> F["Validation Layer\nexpress-validator schemas"]
    F --> G["Controllers\nThin: extract, delegate, respond"]
    G --> H["Service Layer\nBusiness Logic / State Machine / Transactions"]
    H --> I["Prisma ORM\nType-safe / Parameterized / Migrations"]
    I --> J[("Neon PostgreSQL\n28 tables / 17 enums / Indexed")]
```

### Middleware Pipeline

| Order | Middleware | Purpose |
|-------|-----------|---------|
| 1 | `helmet` | 14 security headers: CSP, HSTS, X-Frame-Options |
| 2 | `cors` | Enforces a configured origin allowlist with credentials |
| 3 | `express.json` | Parses JSON bodies, capped at 10 KB |
| 4 | `hpp` | Strips duplicate HTTP query parameters |
| 5 | `morgan` | HTTP access logging per request |
| 6 | `globalLimiter` | 100 req / 15 min per IP across all routes |
| 7 | `authenticate` | JWT verification + account status check |
| 8 | `authorize` | RBAC enforcement: throws 403 on missing role |
| 9 | `express-validator` | Per-route field validation schemas |
| 10 | `validate` | Collects all errors and throws `AppError(400)` |
| 11 | `errorHandler` | Global catcher: structured JSON error envelope |

---

## Technology Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express.js | 4.x | HTTP framework |
| TypeScript | 5.x | Type safety |
| Prisma ORM | 5.x | Database access layer |
| express-validator | 7.x | Request validation |
| jsonwebtoken | 9.x | JWT signing and verification |
| bcrypt | 5.x | Password hashing |
| helmet | 7.x | Security headers |
| winston | 3.x | Structured logging |
| swagger-jsdoc / swagger-ui-express | latest | OpenAPI 3.0.3 documentation |

### Database

| Technology | Purpose |
|------------|---------|
| PostgreSQL 16 | Primary relational database |
| Neon | Serverless PostgreSQL hosting |
| Prisma Migrate | Version-controlled schema migrations |

### Cloud and DevOps

| Technology | Purpose |
|------------|---------|
| Docker | Multi-stage containerized builds |
| Azure Container Registry | Private Docker image registry |
| Azure App Service (Linux) | Primary production host |
| Render | Secondary production host |
| GitHub Actions | CI pipeline: lint, test, Docker build |

### Frontend (Separate Repository)

| Technology | Purpose |
|------------|---------|
| Next.js + TypeScript | React framework |
| TailwindCSS | Utility-first styling |
| Shadcn UI | Component library |
| React Query | Server state management |
| Axios | HTTP client |

---

## Features

### Authentication and Authorization

- **JWT Authentication**: HS256 access tokens (15 min) + refresh tokens (7 days) with separate signing secrets
- **Refresh Token Flow**: token rotation via `POST /auth/refresh`
- **RBAC**: three roles (`CUSTOMER`, `PROVIDER`, `ADMIN`) enforced per-route; a single user may hold multiple roles simultaneously
- **Timing-attack resistance**: `bcrypt.compare()` always runs even for unknown emails to prevent response-time-based email enumeration
- **Account status enforcement**: every authenticated request checks that the user is `ACTIVE`

### Booking System

- Complete state machine with 6 statuses: `PENDING`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `NO_SHOW`
- Invalid transitions rejected with structured `400` errors
- Immutable financial snapshot at booking creation
- Append-only `booking_status_history` audit trail

### Financial System

- **Wallet**: per-user balance with atomic debit/credit operations
- **Immutable ledger**: `wallet_transactions` is insert-only; each row stores `balance_before` and `balance_after`
- **Coupon system**: `PERCENTAGE` and `FLAT` discounts with per-user usage limits, enforced atomically
- **Race condition safe**: Prisma atomic `increment`/`decrement` operators eliminate TOCTOU windows

### Provider Operations

- Verification workflow with document upload (ID, certification, police verification)
- Configurable weekly availability schedule + date-range time-off exceptions
- Custom service pricing per provider
- Denormalized `avg_rating` and `total_reviews` maintained per-write — no `AVG()` on read paths

### Platform Features

- **Reviews**: 1:1 per completed booking with provider reply capability
- **Disputes**: threaded support ticket system (`OPEN`, `IN_REVIEW`, `RESOLVED`, `CLOSED`)
- **Notifications**: typed in-app notification feed with read state
- **Admin dashboard APIs**: document approval, dispute resolution, service catalog management
- **Swagger/OpenAPI 3.0.3**: fully interactive, authorize-once across all endpoints

---

## Database Design

| Property | Value |
|----------|-------|
| Database | PostgreSQL 16 (Neon) |
| ORM | Prisma 5.x |
| Schema | `prisma/schema.prisma` (~1,255 lines) |
| Tables | **28** |
| Enums | **17** |
| Normalization | 3NF with deliberate, documented denormalization |
| User PK | UUID: prevents sequential ID enumeration |
| Other PKs | Auto-increment integer: lighter FK references |
| Monetary fields | `Decimal(10,2)`: exact arithmetic, no IEEE 754 rounding |
| Geospatial fields | `Decimal(10,7)` on lat/lng: approximately 1 cm precision |

### All 28 Tables

| Table | Module | Description |
|-------|--------|-------------|
| `roles` | Auth | Master role list: `CUSTOMER`, `PROVIDER`, `ADMIN` |
| `users` | Auth | UUID PK, bcrypt hash, account status |
| `user_roles` | Auth | M:N junction: user and role |
| `user_profiles` | Users | Display names, avatar, date of birth |
| `provider_profiles` | Providers | Bio, experience, verification status, denormalized aggregates |
| `provider_documents` | Providers | Verification files with per-document status |
| `provider_availability` | Providers | Recurring weekly schedule |
| `provider_time_off` | Providers | Date-range exceptions |
| `provider_services` | Providers | M:N junction: provider and service with custom pricing |
| `service_categories` | Catalog | Top-level categories |
| `services` | Catalog | Admin-curated bookable services |
| `addresses` | Users | Saved addresses with geospatial coordinates |
| `bookings` | Bookings | Core fact table: immutable financial snapshot |
| `booking_status_history` | Bookings | Append-only audit trail |
| `payments` | Payments | Multiple attempts per booking; raw gateway JSON |
| `wallets` | Wallet | Running balance per user |
| `wallet_transactions` | Wallet | Immutable ledger with before/after balance |
| `reviews` | Reviews | 1:1 per completed booking |
| `review_replies` | Reviews | Provider single response |
| `disputes` | Disputes | Support ticket with state machine |
| `dispute_messages` | Disputes | Threaded conversation within dispute |
| `notifications` | Notifications | In-app notification feed |
| `coupons` | Coupons | Admin discount codes |
| `coupon_usages` | Coupons | Per-user redemption tracking |
| `otp_verifications` | Auth | Short-lived OTP codes |

### Key Engineering Decisions

**UUID primary keys on `users`** — eliminates sequential account enumeration. All other tables use auto-increment integers for lower storage overhead.

**Immutable ledger tables** — `wallet_transactions` and `booking_status_history` have no `updatedAt` field by design. Rows are insert-only; point-in-time reconstruction is always possible.

**Denormalized aggregates** — `avg_rating`, `total_reviews`, and `total_bookings` on `provider_profiles` are maintained per-write inside transactions. Public catalog reads never execute `AVG()` or `COUNT()`.

**Atomic concurrent-safe operations** — Wallet debits and coupon `usageCount` increments use Prisma atomic operators. Constraint checks run after the atomic update, not before — eliminating TOCTOU race conditions.

**Price snapshot** — `bookings` stores `baseAmount`, `discountAmount`, and `totalAmount` as immutable snapshots. Future price or coupon changes never retroactively alter financial records.

---

## API Reference

**Base URL:** `https://servicehub-api-niraj2026.azurewebsites.net/api/v1`

All protected routes require:

```
Authorization: Bearer <access_token>
```

### Standard Response Envelope

```json
{ "success": true, "message": "...", "data": {} }

{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "scheduledAt", "message": "Must be a future date" }]
}
```

### Endpoints Summary (43 endpoints across 12 modules)

| Module | Count | Description |
|--------|-------|-------------|
| Auth | 3 | register, login, /me |
| Users | 7 | profile (GET/PUT), addresses (CRUD + default) |
| Providers | 14 | profile, documents, availability, time-off, services |
| Catalog | 3 | categories, services, service detail |
| Bookings | 4 | create, list, detail, status update |
| Wallet | 1 | balance + transaction history |
| Reviews | 3 | list, create, provider reply |
| Notifications | 3 | list, mark read, mark all read |
| Disputes | 4 | open, list, detail, send message |
| Admin | 2 | document approval, dispute resolution |
| Health | 1 | status, environment, uptime |

For complete endpoint details including request/response schemas, see the [Swagger UI](#api-documentation-swagger).

---

## API Documentation (Swagger)

ServiceHub ships with a fully interactive **OpenAPI 3.0.3** specification generated at startup from JSDoc annotations in route files.

| URL | Purpose |
|-----|---------|
| `https://servicehub-api-niraj2026.azurewebsites.net/api-docs/` | Swagger UI (Azure) |
| `https://servicehub-api-13vx.onrender.com/api-docs/` | Swagger UI (Render) |
| `/api-docs.json` | Raw OpenAPI 3.0.3 JSON spec |

**Features:**

- Authorize once: paste your JWT access token and all subsequent requests are authenticated automatically
- `persistAuthorization: true` — token survives browser page refreshes
- Full request body schemas with per-field validation rules
- Reusable error components: 401, 403, 404, 400 with per-field detail
- Auto-detects and displays the correct production server URL

**Seed credentials for Swagger testing:**

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@servicehub.app` | `Password@123` |
| Customer | `amit.gupta@gmail.com` | `Password@123` |
| Provider | `rajesh.kumar@gmail.com` | `Password@123` |

---

## Docker

ServiceHub uses a **production-grade multi-stage Docker build** based on `node:18-bookworm-slim` (Debian 12). Alpine Linux was evaluated and rejected due to a `libssl.so.1.1` incompatibility with Prisma 5.x. Bookworm ships OpenSSL 3.x and glibc, which Prisma's query engine targets correctly.

### Dockerfile overview

```dockerfile
# Stage 1: Builder
FROM node:18-bookworm-slim AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate

# Stage 2: Production
FROM node:18-bookworm-slim AS production
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY . .
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
RUN groupadd -g 1001 nodejs && useradd -u 1001 -g nodejs nodejs \
    && chown -R nodejs:nodejs /app
USER nodejs
EXPOSE 3000
CMD ["npm", "start"]
```

**Why multi-stage?** The builder installs all dependencies and generates the Prisma client, then copies only the compiled output into a clean production image. The final image contains zero dev tools.

### Build and run

```bash
# Build
docker build -t servicehub-api:latest .

# Run standalone
docker run -d -p 3000:3000 --name servicehub-api --env-file .env servicehub-api:latest

# Run with Docker Compose (recommended for local dev)
docker-compose up -d

# Verify
curl http://localhost:3000/api/v1/health
```

The container includes an automatic healthcheck polling `GET /api/v1/health` every 30 seconds with a 20-second boot grace period.

---

## Azure Deployment

ServiceHub is deployed to **Azure App Service (Web App for Containers)** via **Azure Container Registry (ACR)**.

### Resources

| Resource | Name |
|----------|------|
| Resource Group | `servicehub-rg` |
| Container Registry | `servicehubacrniraj2026.azurecr.io` |
| App Service | `servicehub-api-niraj2026` |
| Live URL | `https://servicehub-api-niraj2026.azurewebsites.net` |

### Full deployment from scratch

```bash
# 1. Login
az login
az acr login --name servicehubacrniraj2026

# 2. Build and push image
docker build -t servicehub-api:v1 .
docker tag servicehub-api:v1 servicehubacrniraj2026.azurecr.io/servicehub-api:v1
docker push servicehubacrniraj2026.azurecr.io/servicehub-api:v1

# 3. Create infrastructure
az group create --name servicehub-rg --location eastus
az acr create --name servicehubacrniraj2026 --resource-group servicehub-rg --sku Basic --admin-enabled true
az appservice plan create --name servicehub-plan --resource-group servicehub-rg --sku B1 --is-linux
az webapp create \
  --resource-group servicehub-rg \
  --plan servicehub-plan \
  --name servicehub-api-niraj2026 \
  --deployment-container-image-name servicehubacrniraj2026.azurecr.io/servicehub-api:v1

# 4. Configure environment variables
az webapp config appsettings set \
  --resource-group servicehub-rg \
  --name servicehub-api-niraj2026 \
  --settings \
    NODE_ENV="production" \
    WEBSITES_PORT="3000" \
    DATABASE_URL="<your-neon-connection-string>?sslmode=require" \
    JWT_SECRET="<64-char-secret>" \
    JWT_EXPIRES_IN="15m" \
    JWT_REFRESH_SECRET="<64-char-secret>" \
    JWT_REFRESH_EXPIRES_IN="7d" \
    CORS_ALLOWED_ORIGINS="<your-frontend-url>" \
    LOG_LEVEL="warn" \
    UPLOAD_DIR="/tmp/uploads"

# 5. Restart and verify
az webapp restart --name servicehub-api-niraj2026 --resource-group servicehub-rg
curl https://servicehub-api-niraj2026.azurewebsites.net/api/v1/health
```

> **`WEBSITES_PORT=3000`** is required. It tells Azure's reverse proxy which port the Docker container listens on.
> **Do not set `PORT`** — Azure manages internal port routing via `WEBSITES_PORT`.

### Key deployment notes

- HTTPS is handled automatically by Azure App Service — no certificate management needed
- `UPLOAD_DIR=/tmp/uploads` is required because the App Service container filesystem is ephemeral
- `RENDER_EXTERNAL_URL` is injected with the `.azurewebsites.net` URL so Swagger auto-detects the correct host without any code changes

---

## Render Deployment

ServiceHub is also continuously deployed to **Render** as a secondary production environment.

1. Create a **Web Service** and connect your GitHub repository
2. **Build Command:** `npm install && npx prisma generate`
3. **Start Command:** `node server.js`
4. Set all required environment variables in Render's dashboard (see [Environment Variables](#environment-variables))
5. After first deploy, run `npx prisma migrate deploy` via the Render Shell

Render auto-deploys on every push to `main` after CI passes.

---

## CI/CD Pipeline

Every push and pull request to `main` triggers the full GitHub Actions CI pipeline.

```
trigger: push / pull_request on main

pipeline:
  1. Checkout code
  2. Setup Node.js 18 (with npm cache)
  3. Spin up PostgreSQL 15 service container (ephemeral, isolated)
  4. npm ci
  5. npx prisma generate + prisma migrate deploy
  6. npm run lint          (ESLint: zero warnings enforced)
  7. npm run test          (19/19 integration tests)
  8. docker build          (validates production image builds successfully)
```

The pipeline uses an **ephemeral, self-contained PostgreSQL service container** for integration tests. No external database is touched during CI.

### Required GitHub Secrets

| Secret | Purpose |
|--------|---------|
| `JWT_ACCESS_SECRET` | Signs JWT access tokens during integration tests |
| `JWT_REFRESH_SECRET` | Signs JWT refresh tokens during integration tests |

---

## Testing

ServiceHub features a **production-grade integration test suite** — 19 end-to-end test cases covering all critical API paths.

### Testing architecture

| Concern | Implementation |
|---------|---------------|
| Framework | Jest + Supertest |
| Isolation | Dedicated `test_schema` on Neon PostgreSQL, completely separate from dev/prod |
| State reset | Atomic `TRUNCATE TABLE ... RESTART IDENTITY CASCADE` before every test |
| Safety guard | Destructive operations hard-blocked unless `NODE_ENV=test` AND `schema=test_schema` |
| Connection | Shared `PrismaClient` singleton: mirrors production, prevents pool exhaustion |

### Running tests

```bash
export NODE_ENV=test
export DATABASE_URL="postgresql://user:password@host/db?schema=test_schema"
npm run test
```

---

## Security

| Threat | Mitigation |
|--------|-----------|
| Brute-force login | `express-rate-limit` on auth routes + bcrypt (12 rounds, configurable) |
| Sequential user ID enumeration | UUID primary keys on `users` |
| Email enumeration via timing | `bcrypt.compare()` always runs against a dummy hash for unknown emails |
| JWT tampering | HS256 with separate secrets for access and refresh tokens |
| Privilege escalation | `role.middleware` enforces RBAC on every protected route |
| Stored XSS | `sanitizePlainText()` strips HTML from all free-text inputs before DB write |
| Mass assignment | `express-validator` schemas explicitly block undeclared fields |
| Large payload attacks | `express.json({ limit: "10kb" })` caps request body size |
| Cross-origin requests | CORS allowlist: only configured origins may call the API |
| HTTP header attacks | `helmet` sets 14 security headers including CSP, HSTS, X-Frame-Options |
| HTTP Parameter Pollution | `hpp` middleware deduplicates query parameters |
| SQL injection | 100% Prisma parameterized queries: zero raw SQL |
| Wallet race conditions | Atomic `increment`/`decrement` inside transactions: no TOCTOU window |
| Coupon over-redemption | `usageCount` incremented atomically; rolled back if exceeded |
| Plaintext password storage | bcrypt hash with configurable salt rounds: `passwordHash` never returned in responses |
| Stale session after suspension | User status checked on every authenticated request |

---

## Project Structure

```
ServiceHub/
├── server.js                          # Entry point, HTTP server, graceful shutdown
├── Dockerfile                         # Multi-stage production build (node:18-bookworm-slim)
├── docker-compose.yml                 # Local development orchestration with healthcheck
├── .dockerignore                      # Excludes node_modules, .env, tests from build context
├── .github/
│   └── workflows/
│       └── ci.yml                     # GitHub Actions CI: lint, test, Docker build
├── prisma/
│   ├── schema.prisma                  # Full schema (28 tables, 17 enums, ~1,255 lines)
│   ├── seed.js                        # Realistic seed data (15 users, 38 bookings)
│   └── migrations/                    # Prisma migration history (version-controlled)
├── src/
│   ├── app.js                         # Express factory: middleware, Swagger, routing
│   ├── config/
│   │   ├── env.js                     # Environment loading with fail-fast production guard
│   │   ├── prisma.js                  # Shared PrismaClient singleton
│   │   ├── swagger.js                 # OpenAPI 3.0.3 config (auto-detects host URL)
│   │   ├── auth.constants.js          # JWT header/prefix constants
│   │   └── roles.js                   # ROLES enum
│   ├── middleware/
│   │   ├── auth.middleware.js         # JWT verification + account status + role attachment
│   │   ├── role.middleware.js         # RBAC enforcement per route
│   │   ├── validate.js                # Collects express-validator errors
│   │   ├── rateLimiter.js             # Global + auth-specific rate limiters
│   │   ├── requestId.js               # Attaches unique request ID to every request
│   │   ├── requestLogger.js           # Morgan HTTP access logger
│   │   └── errorHandler.js            # Global error handler + 404 catch-all
│   ├── routes/
│   │   └── index.js                   # Central route registry
│   ├── modules/
│   │   ├── auth/                      # register, login, /me
│   │   ├── users/                     # profile, addresses
│   │   ├── providers/                 # profile, documents, availability, time-off, services
│   │   ├── catalog/                   # categories, services, detail
│   │   ├── bookings/                  # create, list, detail, state machine
│   │   ├── wallets/                   # balance + ledger history
│   │   ├── reviews/                   # list, create, reply
│   │   ├── notifications/             # list, read, read-all
│   │   ├── disputes/                  # open, list, detail, thread
│   │   ├── admin/                     # document approval, dispute resolution
│   │   └── health/                    # health check endpoint
│   ├── validations/                   # express-validator schemas (one per domain)
│   ├── utils/
│   │   ├── ApiResponse.js             # Standardized JSON response envelope
│   │   ├── AppError.js                # Custom error class
│   │   ├── jwt.util.js                # Token sign + verify helpers
│   │   ├── password.util.js           # bcrypt hash + compare
│   │   ├── pagination.util.js         # Consistent offset pagination
│   │   ├── sanitize.util.js           # HTML stripping (XSS prevention)
│   │   └── logger.js                  # Winston configuration
│   └── errors/                        # Domain-specific typed error classes
├── tests/                             # Jest + Supertest integration test suite (19 tests)
├── docs/                              # Technical documentation
├── uploads/                           # Provider document storage (local dev)
├── logs/                              # Winston daily-rotated log files
├── .env.example                       # All required variables documented
└── package.json                       # v1.0.0, Node >= 18, npm >= 9
```

---

## Installation

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | >= 18.0.0 |
| npm | >= 9.0.0 |
| PostgreSQL | >= 14 (or Neon account) |
| Docker | Optional, for containerized local dev |

### Local setup

```bash
# 1. Clone
git clone https://github.com/<your-username>/ServiceHub.git
cd ServiceHub

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env -- fill in DATABASE_URL and JWT secrets

# 4. Set up database
npx prisma migrate deploy
npx prisma generate
npm run seed   # optional: load realistic seed data

# 5. Start development server
npm run dev

# 6. Verify
curl http://localhost:3000/api/v1/health
# Open http://localhost:3000/api-docs for Swagger UI
```

### Docker (recommended)

```bash
docker-compose up -d
curl http://localhost:3000/api/v1/health
```

### npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development with nodemon auto-restart |
| `npm start` | Production: `node server.js` |
| `npm run test` | Full integration test suite (sequential) |
| `npm run lint` | ESLint: zero warnings enforced |
| `npm run format` | Prettier auto-format |
| `npm run seed` | Load realistic seed data |
| `npm run prisma:studio` | Visual database browser |
| `npm run prisma:migrate` | Apply migrations (dev) |
| `npm run prisma:migrate:prod` | Apply migrations (production) |

---

## Environment Variables

Copy `.env.example` to `.env` and populate every value before starting the server.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | `development` | `development` / `production` / `test` |
| `PORT` | No | `3000` | Port Express listens on |
| `DATABASE_URL` | **Yes** | — | Full PostgreSQL connection string (include `?sslmode=require` for Neon) |
| `JWT_SECRET` | **Yes** | — | Access token signing secret, minimum 64 random characters |
| `JWT_EXPIRES_IN` | No | `15m` | Access token lifetime |
| `JWT_REFRESH_SECRET` | **Yes** | — | Refresh token secret, must differ from `JWT_SECRET` |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | Refresh token lifetime |
| `CORS_ALLOWED_ORIGINS` | Yes | `http://localhost:3000` | Comma-separated list of permitted origins |
| `RATE_LIMIT_WINDOW_MINUTES` | No | `15` | Rate limit window duration in minutes |
| `RATE_LIMIT_MAX_REQUESTS` | No | `100` | Max requests per IP per window |
| `LOG_LEVEL` | No | `info` | `error` / `warn` / `info` / `http` / `debug` |
| `MAX_FILE_SIZE_BYTES` | No | `5242880` | Max upload size in bytes (default 5 MB) |
| `UPLOAD_DIR` | No | `uploads` | Upload directory — use `/tmp/uploads` on Azure |
| `BCRYPT_SALT_ROUNDS` | No | `12` | bcrypt work factor |

**Generate production secrets:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Performance Benchmarks

Load tests run with `autocannon` — 50 concurrent connections over 30 seconds against a Neon Free Tier database (network-constrained environment).

| Endpoint | Auth | Avg Latency | p99 Latency | Throughput | Error Rate |
|----------|------|-------------|-------------|------------|------------|
| `GET /api/v1/health` | Public | 230 ms | 302 ms | ~216 req/s | **0%** |
| `GET /api/v1/catalog/services` | Public | 827 ms | 1.18 s | ~60 req/s | **0%** |
| `GET /api/v1/notifications` | JWT | 1.13 s | 1.51 s | ~43 req/s | **0%** |

Zero error rates across all tests. Numbers reflect a single Node.js process on Neon Free Tier with significant network latency.

---

## Production Highlights

| Achievement | Detail |
|-------------|--------|
| **Dual cloud deployment** | Running simultaneously on Azure App Service and Render |
| **Dockerized** | Multi-stage build, non-root container, healthcheck, OpenSSL Prisma compatibility resolved |
| **Azure Container Registry** | Image stored and pulled from private ACR |
| **Neon PostgreSQL** | Serverless managed PostgreSQL with SSL-enforced connection |
| **GitHub Actions CI** | Automated lint, test, Docker build on every push to `main` |
| **19/19 integration tests** | Jest + Supertest: isolated test_schema, atomic teardown, singleton pooling |
| **43 REST endpoints** | Across 12 domain modules: all validated, all Swagger-documented |
| **OpenAPI 3.0.3** | Interactive Swagger UI deployed and publicly accessible |
| **RBAC** | Three-role system with per-route enforcement: zero controller-level role checks |
| **Concurrent-safe transactions** | Atomic wallet and coupon operations: no race conditions |
| **Immutable audit trail** | booking_status_history and wallet_transactions are insert-only |
| **28-table schema** | 3NF-normalized, 17 enums, 40+ database indexes |
| **Security hardened** | Helmet, CORS, rate limiting, HPP, XSS sanitization, UUID PKs |

---

## Known Limitations and Roadmap

### Current limitations

| Limitation | Detail |
|------------|--------|
| No payment gateway | Schema is complete; Razorpay/Stripe integration not yet wired |
| No real-time notifications | Notifications require HTTP polling — no WebSocket/SSE |
| OTP schema-complete only | OTP table is fully designed; email/SMS delivery endpoints not implemented |
| Local file storage | Provider documents stored under `uploads/` — replace with S3/R2 for production scale |
| No coupon management API | Coupons are enforced; admin CRUD for creating codes is not exposed |
| Proximity-unaware discovery | `addresses` stores lat/lng but provider discovery is not yet filtered by distance |

### Roadmap

- [ ] Payment gateway integration (Razorpay / Stripe) for wallet top-up and direct booking payment
- [ ] Real-time notifications via Socket.IO or Server-Sent Events
- [ ] OTP flows: complete email/phone verification and password reset pipeline
- [ ] Cloud file storage: AWS S3 / Cloudflare R2 with file type and size validation
- [ ] Background job runner: BullMQ / pg-boss for OTP expiry, coupon deactivation, notification scheduling
- [ ] Geospatial provider discovery: PostGIS radius filtering by customer coordinates
- [ ] Admin reporting API: revenue summaries, booking analytics, provider performance dashboards
- [ ] Coupon management API: admin CRUD for discount codes

---

## Contributing

```bash
# Fork the repository, then:
git checkout -b feature/your-feature-name

# Make your changes
npm run lint      # must pass: zero warnings
npm run format    # auto-format with Prettier
npm run test      # must pass: all 19 tests

git commit -m "feat: describe your change concisely"
git push origin feature/your-feature-name
# Open a pull request against main
```

**PR requirements:**

- Zero ESLint warnings
- All integration tests must pass
- New endpoints must include `express-validator` validation schemas and Swagger JSDoc annotations
- New PRs should include or update relevant test coverage

---

## License

**ISC License**

Copyright (c) 2026 ServiceHub Engineering

Permission to use, copy, modify, and distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

---

<div align="center">

**ServiceHub API v1.0.0**

Node.js · Express · Prisma ORM · PostgreSQL · Docker · Azure · Render · GitHub Actions

28 tables · 17 enums · 43 endpoints · 19 integration tests · Dual cloud deployment

</div>
