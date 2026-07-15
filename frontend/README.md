# ServiceHub — Frontend

> **Multi-Vendor Home Services Marketplace** — A production-grade Next.js application that connects customers with verified home service providers, powered by a Node.js/Express REST API backend.

---

## Table of Contents

- [Overview](#overview)
- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Production Build](#production-build)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)
- [Future Roadmap](#future-roadmap)
- [License](#license)

---

## Overview

ServiceHub is a full-stack, multi-tenant marketplace for home services. The frontend is a **Next.js 16 (App Router)** application with a strict, layered architecture. It supports three distinct user roles:

| Role | Description |
|------|-------------|
| **Customer** | Browse services, book providers, manage bookings, wallet, and reviews |
| **Provider** | Manage profile, services, availability, time-offs, and incoming bookings |
| **Admin** | Dashboard overview, manage bookings, and resolve disputes |

---

## Architecture Overview

The application enforces a strict, unidirectional data flow to keep every layer cleanly separated:

```
Pages
  ↓
Presentational Components
  ↓
React Query Hooks
  ↓
Feature Services
  ↓
Axios (src/lib/api.ts)
  ↓
Backend REST API
```

### Data Mapping Pipeline

API responses from the backend are never used directly in the UI. They flow through a transformation pipeline:

```
Backend JSON Response (API DTO)
  ↓
Feature Service  (calls the API, returns raw DTO)
  ↓
Mapper           (transforms DTO → clean Domain Model)
  ↓
React Query Hook (caches the Domain Model, exposes it to the component)
  ↓
Presentational Component (renders Domain Model — never knows about HTTP)
```

This means components are completely decoupled from the backend contract. When a backend field changes, only the mapper needs updating — not the UI.

**Why this architecture?**

- **Testability** — each layer can be unit-tested independently.
- **Maintainability** — backend changes are isolated to mappers and services.
- **Type Safety** — `ApiDto` types and `DomainModel` types are strictly separate.
- **Scalability** — new features follow the same pattern, keeping the codebase consistent.

---

## Technology Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [Next.js 16.2](https://nextjs.org/) (App Router) |
| **UI Library** | [shadcn/ui](https://ui.shadcn.com/) + [Base UI](https://base-ui.com/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **State / Data Fetching** | [TanStack React Query v5](https://tanstack.com/query) |
| **HTTP Client** | [Axios v1](https://axios-http.com/) |
| **Forms** | [React Hook Form v7](https://react-hook-form.com/) |
| **Validation** | [Zod v4](https://zod.dev/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |
| **Language** | TypeScript 5 (strict) |
| **Runtime** | Node.js ≥ 20 |

---

## Features

### Authentication
- User registration (Customer & Provider)
- JWT-based login with automatic token refresh on 401
- Role-based route protection (AuthGuard + RoleGuard)
- Persistent sessions via localStorage

### Customer Module
- **Service Catalog** — Browse services by category, view service details
- **Booking Flow** — Book a provider service with date/time selection
- **Bookings Management** — View all bookings, cancel active bookings
- **Wallet** — View wallet balance and transaction history
- **Reviews** — Submit and view reviews for completed services
- **Profile** — Manage personal information and addresses

### Provider Module
- **Profile** — Update bio, experience, availability status, and avatar
- **Documents** — Upload and manage verification documents (ID, certifications, etc.)
- **Services** — Add, edit, and remove offered services with custom pricing
- **Availability** — Configure weekly recurring availability schedule
- **Time-Off** — Block specific date ranges from receiving bookings
- **Bookings** — View and manage incoming bookings, accept/reject/complete

### Admin Module
- **Dashboard** — Platform overview statistics (Milestone 4A)
- **Bookings Management** — View and manage all platform bookings (Milestone 4C)
- **Disputes Management** — View, respond to, and resolve customer disputes (Milestone 4C)

---

## Folder Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages & layouts
│   │   ├── (admin)/            # Admin route group (role-guarded)
│   │   ├── (auth)/             # Auth routes (login, register)
│   │   ├── (customer)/         # Customer route group (role-guarded)
│   │   ├── (provider)/         # Provider route group (role-guarded)
│   │   ├── layout.tsx          # Root layout (providers, fonts, themes)
│   │   └── globals.css         # Global styles
│   ├── features/               # Feature modules (core of the app)
│   │   ├── admin/              # Admin feature (bookings, disputes)
│   │   ├── auth/               # Authentication (login, register forms)
│   │   ├── booking/            # Customer booking feature
│   │   ├── catalog/            # Service catalog
│   │   ├── customer-dashboard/ # Customer dashboard feature
│   │   ├── profile/            # User profile & addresses
│   │   ├── provider/           # Provider profile, services, bookings
│   │   ├── reviews/            # Review submission & listing
│   │   ├── service-details/    # Detailed service & provider listing page
│   │   └── wallet/             # Wallet & transaction history
│   ├── components/             # Shared UI components
│   │   └── ui/                 # shadcn/ui primitives (Button, Card, etc.)
│   ├── constants/              # App-wide constants
│   │   ├── routes.ts           # All frontend page routes
│   │   ├── apiRoutes.ts        # All backend API endpoint paths
│   │   ├── navigation.ts       # Sidebar/navbar navigation config
│   │   ├── roles.ts            # User role definitions
│   │   └── storageKeys.ts      # localStorage key constants
│   ├── hooks/                  # Shared global hooks (e.g. useIsClient)
│   ├── lib/                    # Infrastructure
│   │   └── api.ts              # Axios singleton (JWT injection, 401 handling)
│   ├── providers/              # React context providers
│   │   ├── AuthProvider.tsx    # Authentication context & session management
│   │   ├── QueryProvider.tsx   # TanStack React Query client
│   │   ├── SidebarProvider.tsx # Sidebar open/close state
│   │   └── ThemeProvider.tsx   # Dark/light theme provider
│   ├── shared/                 # Shared domain types used across features
│   │   └── types/              # e.g. Address domain type
│   ├── types/                  # Global TypeScript types
│   │   └── api.ts              # Shared API response shapes (ApiErrorResponse)
│   ├── utils/                  # Utility functions
│   │   └── parseApiError.ts    # Extracts human-readable errors from Axios errors
│   └── validations/            # Shared Zod schemas
├── .env.example                # Environment variable template
├── package.json
├── next.config.ts
└── tsconfig.json
```

### Feature Module Structure

Every feature follows the same internal structure:

```
features/<feature-name>/
├── components/     # Presentational components (display only, no business logic)
├── hooks/          # React Query hooks (useQuery, useMutation)
├── services/       # API call functions (only place Axios is used)
├── mappers/        # DTO → Domain Model transformation functions
├── types/
│   ├── api.types.ts     # Backend DTO types (what the API returns)
│   └── domain.types.ts  # Clean domain model (what the UI consumes)
└── query/          # React Query key factories
```

---

## Installation & Setup

### Prerequisites

- **Node.js** `>= 20.x` (LTS recommended)
- **npm** `>= 10.x`
- The **ServiceHub backend** running (see backend README)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-org/servicehub.git
cd servicehub/frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your values (see Environment Variables section)

# 4. Start the development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL of the ServiceHub backend API | `http://localhost:5000/api/v1` |
| `NEXT_PUBLIC_APP_NAME` | Application display name | `ServiceHub` |
| `NEXT_PUBLIC_APP_URL` | Application public URL | `http://localhost:3000` |

> **Note:** All `NEXT_PUBLIC_` variables are exposed to the browser. Never put secrets here.

---

## Running Locally

```bash
# Development server with hot reload
npm run dev

# Production build (outputs to .next/)
npm run build

# Start production server (requires build first)
npm run start

# Lint
npm run lint
```

---

## Production Build

```bash
# Create an optimized production build
npm run build

# Verify the build output
npm run start
```

The build produces static and server-rendered pages. All 24 routes are compiled and type-checked during the build process. A successful build confirms zero TypeScript errors.

---

## Deployment

See [docs/Deployment.md](./docs/Deployment.md) for a full deployment guide. In summary:

1. Set all required environment variables on your host (Vercel, Railway, etc.)
2. Run `npm run build`
3. Run `npm run start` (or configure your host to do so automatically)
4. Point `NEXT_PUBLIC_API_URL` to your deployed backend URL

For **Vercel** (recommended):
```bash
npx vercel --prod
```

---

## Known Limitations

The following features are **intentionally absent** from the frontend because the backend does not currently expose the required HTTP endpoints. These are tracked and will be implemented in future milestones once backend support is added.

| Feature | Status | Reason |
|---------|--------|--------|
| Admin User Management | ⛔ Blocked | No backend API |
| Admin Provider Management | ⛔ Blocked | No backend API |
| Coupon Management | ⛔ Blocked | No backend API |
| Reports & Analytics | ⛔ Blocked | No backend API |

See [docs/Known-Limitations.md](./docs/Known-Limitations.md) for details.

---

## Future Roadmap

- [ ] Admin User & Provider Management (pending backend)
- [ ] Coupon Management (pending backend)
- [ ] Reports & Analytics Dashboard (pending backend)
- [ ] Real-time Notifications (WebSocket)
- [ ] Customer Dispute Creation UI
- [ ] Provider Earnings History
- [ ] Full mobile-responsive redesign
- [ ] E2E tests (Playwright/Cypress)
- [ ] Unit tests (Vitest + React Testing Library)

---

## License

This project is licensed under the **ISC License**.

---

## Contributors

- Project Lead & Developer — *Niraj*
