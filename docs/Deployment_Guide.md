# Deployment Guide

This guide outlines the prerequisites, environment configuration, and steps required to deploy the ServiceHub backend to a production environment.

## Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14

## Environment Variables (Overview)
*See `Environment_Guide.md` for detailed variable documentation.*
Ensure the following are set in your production environment before deploying:
- `NODE_ENV=production`
- `DATABASE_URL` (Must point to the production DB, with `?sslmode=require`)
- `JWT_SECRET` and `JWT_REFRESH_SECRET`
- `CORS_ALLOWED_ORIGINS` (Production frontend URLs only)

## Production Deployment Steps

```bash
# 1. Pull latest code
git pull origin main

# 2. Install production dependencies only
npm install --omit=dev

# 3. Generate Prisma client for the production platform
npx prisma generate

# 4. Apply database migrations safely
# CRITICAL: Do NOT use `prisma migrate dev` in production
npx prisma migrate deploy

# 5. Seed initial data (only necessary on the very first deployment)
npm run seed

# 6. Start the application
npm start
```

## Process Management (PM2)
For production process management, PM2 is recommended.

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start server.js --name servicehub-api

# Ensure PM2 restarts the app on server reboot
pm2 startup
pm2 save

# View logs
pm2 logs servicehub-api

# Restart after a new deployment
pm2 restart servicehub-api
```

## Health Check
Verify the deployment by hitting the health check endpoint:
`GET /api/v1/health`

Expected response:
```json
{
  "status": "healthy",
  "environment": "production",
  "timestamp": "2026-07-15T12:00:00.000Z",
  "uptime": 120.4
}
```

## Production Security Checklist
- [ ] `NODE_ENV=production` is set.
- [ ] `JWT_SECRET` is a secure, random string (>= 64 chars).
- [ ] `DATABASE_URL` uses SSL (`?sslmode=require`).
- [ ] `CORS_ALLOWED_ORIGINS` lists only production domains.
- [ ] `LOG_LEVEL` is set to `warn` or `error`.
- [ ] Swagger UI is disabled or protected via reverse proxy.
- [ ] Firewall: only ports 80/443 exposed publicly. PostgreSQL port (5432) is isolated.
- [ ] Reverse proxy (Nginx/Caddy) is configured with SSL termination.

## Graceful Shutdown
The server natively handles `SIGTERM` and `SIGINT` signals (which PM2 uses for restarts):
1. Stops accepting new HTTP connections.
2. Waits for in-flight requests to complete.
3. Disconnects the Prisma client from PostgreSQL.
4. Exits cleanly (Force-exit timeout: 10 seconds).
