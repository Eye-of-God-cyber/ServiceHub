# Environment Variables Guide

This guide explains every environment variable used in the ServiceHub backend, detailing their purpose and recommended values.

## Application Settings

### `NODE_ENV`
Controls the environment mode of the application.
- **Options**: `development` | `production` | `test`
- **Default**: `development`
- **Effect**: Changes log formatting (colorized in dev, JSON in prod), Swagger UI visibility (often hidden in prod), and error handling (stack traces hidden in prod).

### `PORT`
The HTTP port the Express server will listen on.
- **Default**: `5000`
- **Note**: In production, it's common to keep this at 5000 and use a reverse proxy (like Nginx) to route external traffic from port 443 (HTTPS) to port 5000.

## Database

### `DATABASE_URL`
The full connection string used by Prisma to connect to PostgreSQL.
- **Format**: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA`
- **Dev Example**: `postgresql://postgres:password@localhost:5432/servicehub_db?schema=public`
- **Prod Example**: `postgresql://dbuser:secure_pwd@db.internal:5432/servicehub_prod?schema=public&sslmode=require`
- **Important**: Always append `?sslmode=require` in production if connecting to a managed database (e.g., AWS RDS, Heroku Postgres) over a network.

## Authentication

### `JWT_SECRET`
Used to cryptographically sign access tokens.
- **Requirement**: Must be a strong, unpredictable random string (at least 64 characters).
- **Generation Method**: Run `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` in your terminal.

### `JWT_EXPIRES_IN`
The lifetime of the access token.
- **Format**: Vercel `ms` string format (e.g., `15m`, `1h`, `7d`).
- **Recommendation**: `15m` for production security.

### `JWT_REFRESH_SECRET`
Used to sign refresh tokens.
- **Requirement**: Must be completely different from `JWT_SECRET`.

### `JWT_REFRESH_EXPIRES_IN`
The lifetime of the refresh token.
- **Format**: Same as above (e.g., `7d`, `30d`).
- **Note**: The refresh token flow is slated for v1.1.

## CORS & Networking

### `CORS_ALLOWED_ORIGINS`
Controls which external domains can make requests to the API.
- **Format**: Comma-separated list (no trailing slashes).
- **Dev Example**: `http://localhost:3000,http://localhost:5173`
- **Prod Example**: `https://app.servicehub.com,https://admin.servicehub.com`
- **Note**: Mobile applications (which do not send an Origin header) are intrinsically allowed.

## Rate Limiting

### `RATE_LIMIT_WINDOW_MINUTES`
The time window for tracking requests.
- **Default**: `15`

### `RATE_LIMIT_MAX_REQUESTS`
The maximum number of requests a single IP address can make within the time window.
- **Default**: `100`

## Logging

### `LOG_LEVEL`
Sets the minimum severity level of logs to be recorded.
- **Options**: `error` | `warn` | `info` | `http` | `debug`
- **Dev Recommendation**: `debug` or `http`
- **Prod Recommendation**: `warn` or `error`

## File Uploads

### `MAX_FILE_SIZE_BYTES`
The maximum size allowed for file uploads.
- **Default**: `5242880` (5MB)

### `UPLOAD_DIR`
The directory where uploaded files are saved (relative to project root).
- **Default**: `uploads`

## Security

### `BCRYPT_SALT_ROUNDS`
The work factor used for password hashing.
- **Default/Recommended**: `12`
- **Warning**: Do not lower this below 10. Higher numbers increase security but consume more CPU time during login/registration.
