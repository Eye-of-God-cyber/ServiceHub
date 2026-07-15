# Deployment Guide — ServiceHub Frontend

This guide covers everything needed to build and deploy the ServiceHub frontend to a production environment.

---

## Overview

The ServiceHub frontend is a **Next.js 16** application that supports both:
- **Static + Server-Rendered** pages (current default — uses `next start`)
- **Static Export** (if the backend is always available at build time — not recommended for this project)

The recommended deployment target is **Vercel** (built by the Next.js team), but any Node.js-capable host works (Railway, Render, Fly.io, AWS, etc.).

---

## Prerequisites

- Node.js `>= 20.x` on the deployment host
- The **ServiceHub backend** is deployed and publicly accessible
- All required environment variables configured on the host

---

## Environment Variables for Production

| Variable | Required | Example |
|----------|----------|---------|
| `NEXT_PUBLIC_API_URL` | ✅ Yes | `https://api.servicehub.app/api/v1` |
| `NEXT_PUBLIC_APP_NAME` | Optional | `ServiceHub` |
| `NEXT_PUBLIC_APP_URL` | Optional | `https://servicehub.app` |

> **Critical**: `NEXT_PUBLIC_API_URL` must point to the deployed backend — not `localhost`. All `NEXT_PUBLIC_` variables are embedded in the client-side bundle at build time.

---

## Build Process

```bash
# 1. Install dependencies (production + dev — needed for build)
npm install

# 2. Create the optimized production build
npm run build
```

A successful build will output a route manifest like:

```
Route (app)
┌ ○ /
├ ○ /admin
├ ○ /admin/bookings
├ ○ /admin/disputes
├ ○ /bookings
├ ƒ /bookings/[bookingId]
├ ○ /dashboard
├ ○ /login
...

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

Zero TypeScript errors and zero lint warnings are required for a valid production build.

---

## Running in Production

```bash
# Start the production server
npm run start
```

This starts the Next.js production server on port `3000` by default. To use a different port:

```bash
npm run start -- -p 8080
```

---

## Deployment: Vercel (Recommended)

Vercel provides zero-configuration deployment for Next.js apps.

### Option A — Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from the frontend/ directory
vercel --prod
```

Vercel will detect Next.js automatically and configure the build and start commands.

### Option B — GitHub Integration

1. Push the repository to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub.
3. Set the **Root Directory** to `frontend/`.
4. Add all required environment variables in the Vercel dashboard under **Settings → Environment Variables**.
5. Click **Deploy**.

Every push to `main` will trigger an automatic redeploy.

### Vercel Environment Variables

Set these in the Vercel project dashboard:

```
NEXT_PUBLIC_API_URL   = https://api.servicehub.app/api/v1
NEXT_PUBLIC_APP_NAME  = ServiceHub
NEXT_PUBLIC_APP_URL   = https://servicehub.app
```

---

## Deployment: Railway

1. Create a new project in [Railway](https://railway.app).
2. Connect your GitHub repository.
3. Set the **Root Directory** to `frontend/`.
4. Railway auto-detects Next.js. Set the start command to `npm run start`.
5. Add environment variables in the Railway dashboard.
6. Deploy.

---

## Deployment: Docker (Manual)

For container-based deployments, create a `Dockerfile` in `frontend/`:

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "run", "start"]
```

Build and run:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.servicehub.app/api/v1 \
  --build-arg NEXT_PUBLIC_APP_NAME=ServiceHub \
  --build-arg NEXT_PUBLIC_APP_URL=https://servicehub.app \
  -t servicehub-frontend .

docker run -p 3000:3000 servicehub-frontend
```

> **Note**: `NEXT_PUBLIC_` variables are baked into the client bundle at build time, so they **must** be provided as `--build-arg` during `docker build`, not at runtime.

---

## Deployment Checklist

Use this checklist before every production deployment:

```
Pre-deployment
□ NEXT_PUBLIC_API_URL points to the deployed backend (not localhost)
□ Backend is running and accepting requests
□ Backend CORS config allows the production frontend URL
□ npm run build completes with zero errors and zero warnings
□ npm run lint passes with zero issues

Post-deployment
□ Visit the production URL — landing page loads
□ Login with a test account — JWT auth works
□ Load the service catalog — API connection is working
□ Create a test booking — write operations work
□ Verify admin panel access for ADMIN role users
□ Check browser console for no unexpected errors
```

---

## Production Verification

After deployment, confirm the following manually:

1. **Authentication** — Login and register with real credentials.
2. **API Connectivity** — Service catalog loads data from the backend.
3. **Role Routing** — Admin users reach `/admin`, customers reach `/dashboard`, providers reach `/provider`.
4. **Error Handling** — A 404 service ID shows the Next.js 404 page correctly.
5. **401 Handling** — Tamper with the JWT in localStorage; the app should redirect to `/login`.

---

## Rollback

If a deployment introduces regressions:

- **Vercel**: Click **Deployments** → find the last working deployment → **Redeploy**.
- **Railway**: Click the deployment history and redeploy a previous build.
- **Docker**: Re-tag and re-deploy the previous image version.
