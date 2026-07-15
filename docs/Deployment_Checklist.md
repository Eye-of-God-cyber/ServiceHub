# Deployment Checklist

A comprehensive pre-deployment checklist for releasing the ServiceHub backend to production.

## 1. Environment Variables
- [ ] `NODE_ENV` is set to `production`.
- [ ] `PORT` is configured (recommend 5000, reverse-proxied behind Nginx/Caddy).
- [ ] `DATABASE_URL` points to production PostgreSQL instance.
- [ ] `DATABASE_URL` includes `?sslmode=require` for encrypted connections.
- [ ] `JWT_SECRET` is at minimum 64 random characters (generated securely).
- [ ] `JWT_REFRESH_SECRET` is different from `JWT_SECRET`.
- [ ] `JWT_EXPIRES_IN` is set (recommendation: `15m`).
- [ ] `CORS_ALLOWED_ORIGINS` lists only production domains (no localhost).
- [ ] `RATE_LIMIT_WINDOW_MINUTES` and `RATE_LIMIT_MAX_REQUESTS` are tuned.
- [ ] `LOG_LEVEL` is set to `warn` or `error`.
- [ ] `BCRYPT_SALT_ROUNDS` is `12` or higher.

## 2. Production Build & Dependencies
- [ ] `npm install --omit=dev` executed (no devDependencies in production).
- [ ] `npx prisma generate` executed after install.
- [ ] Node.js version >= 18.0.0 confirmed on production server.
- [ ] `package-lock.json` committed and used for deterministic installs.
- [ ] ESLint passes with zero warnings (`npm run lint`).
- [ ] Prettier formatting check passes (`npm run format:check`).

## 3. Database
- [ ] Production PostgreSQL is provisioned and accessible.
- [ ] `npx prisma migrate deploy` executed safely (NOT `migrate dev`).
- [ ] Initial seed data run (`npm run seed`) — *first deployment only*.
- [ ] Roles seeded: CUSTOMER, PROVIDER, ADMIN.
- [ ] Database backups enabled via hosting provider.
- [ ] SSL enabled on PostgreSQL connection.
- [ ] Database is strictly inaccessible from the public internet.

## 4. Security
- [ ] Helmet security headers active (verify with securityheaders.com).
- [ ] Rate limiting active.
- [ ] No sensitive data in error responses (ensured by `NODE_ENV=production`).
- [ ] Swagger UI (`/api-docs`) disabled or protected via reverse proxy rules.
- [ ] `uploads/` directory not publicly accessible if storing sensitive docs.
- [ ] No hardcoded secrets in source code.
- [ ] `.env` file NOT committed to git.

## 5. Logging & Monitoring
- [ ] `logs/` directory exists and has correct write permissions.
- [ ] Application logs are writing to `logs/application-*.log`.
- [ ] Error logs are writing to `logs/error-*.log`.
- [ ] Uptime monitoring configured (e.g., UptimeRobot) pointing to `/api/v1/health`.

## 6. Process Management & Networking
- [ ] PM2 installed globally and application started via PM2.
- [ ] PM2 startup script configured (`pm2 startup && pm2 save`).
- [ ] Reverse proxy (Nginx/Caddy) configured with SSL termination.
- [ ] HTTP automatically redirects to HTTPS.
- [ ] Firewall rules: only 80 (HTTP) and 443 (HTTPS) exposed.

## 7. API Smoke Tests (Post-Deploy)
Run these checks immediately after traffic starts flowing:
- [ ] `GET /api/v1/health` returns HTTP 200.
- [ ] `POST /api/v1/auth/login` successfully returns a JWT.
- [ ] `GET /api/v1/catalog/categories` returns active categories.
- [ ] Providing an invalid token returns a `401 Unauthorized`.
- [ ] Triggering a missing field returns `400 Bad Request` with an errors array.
