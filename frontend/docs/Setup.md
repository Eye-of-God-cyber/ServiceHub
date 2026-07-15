# Setup Guide — ServiceHub Frontend

This guide walks you through setting up the ServiceHub frontend for local development from scratch.

---

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| **Node.js** | `>= 20.x` LTS | [Download](https://nodejs.org/en/download) |
| **npm** | `>= 10.x` | Bundled with Node.js 20 |
| **Git** | Any | [Download](https://git-scm.com/) |
| **ServiceHub Backend** | Running locally | See backend README |

> The frontend calls the ServiceHub backend REST API. The backend must be running before the frontend can load data.

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/your-org/servicehub.git
cd servicehub/frontend
```

If you already have the repository, just navigate to the `frontend/` subfolder.

---

## Step 2 — Install Dependencies

```bash
npm install
```

This installs all runtime and development dependencies as specified in `package.json`.

---

## Step 3 — Configure Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and configure the values:

```env
# The base URL of the ServiceHub backend.
# In local development, the backend typically runs on port 5000.
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Application display name
NEXT_PUBLIC_APP_NAME=ServiceHub

# Application public URL (used for metadata and OG tags)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Important**: All `NEXT_PUBLIC_` variables are embedded into the client-side bundle at build time. Never put secrets or private keys in these variables.

---

## Step 4 — Start the Backend

Before starting the frontend, make sure the ServiceHub backend is running. Refer to the backend README for instructions. By default it runs at:

```
http://localhost:5000
```

---

## Step 5 — Start the Development Server

```bash
npm run dev
```

The app will be available at:

```
http://localhost:3000
```

Hot Module Replacement (HMR) is enabled — changes to files reflect instantly in the browser without a full page reload.

---

## Step 6 — Verify the Setup

1. Open `http://localhost:3000` — you should see the landing page.
2. Click **Login** and use a seeded test account (see backend seed script).
3. If you see API data loading, the connection to the backend is working correctly.

---

## Common Roles for Testing

After running `npm run seed` on the backend, the following test accounts are typically available:

| Role | Email | Password |
|------|-------|----------|
| Customer | `customer@servicehub.test` | `Password123!` |
| Provider | `provider@servicehub.test` | `Password123!` |
| Admin | `admin@servicehub.test` | `Password123!` |

> Check the backend seed script for the exact credentials.

---

## Development Scripts

```bash
# Start development server with hot reload
npm run dev

# Type-check and lint
npm run lint

# Create production build
npm run build

# Start production server (requires build)
npm run start
```

---

## Troubleshooting

### "Cannot connect to the server"
- Make sure the backend is running at the URL specified in `NEXT_PUBLIC_API_URL`.
- Check that there are no CORS errors in the browser console.
- Verify the backend CORS config allows `http://localhost:3000`.

### TypeScript errors after `npm install`
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port conflicts
If port 3000 is in use:
```bash
# Run on a different port
npx next dev -p 3001
```
Then update `NEXT_PUBLIC_APP_URL=http://localhost:3001` in `.env.local`.

### Environment variables not loading
- Make sure the file is named exactly `.env.local` (not `.env`).
- Restart the development server after any changes to `.env.local`.
- All variable names must start with `NEXT_PUBLIC_` to be available in the browser.
