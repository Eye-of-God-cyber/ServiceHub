'use strict';

const path = require('path');
const dotenv = require('dotenv');

// ─────────────────────────────────────────────────────────
// Load the correct .env file based on the current environment.
// In production, environment variables should be injected by the
// hosting platform (e.g. Railway, Render, AWS), so .env may not exist.
// ─────────────────────────────────────────────────────────
const NODE_ENV = process.env.NODE_ENV || 'development';
const envFile = NODE_ENV === 'test' ? '.env.test' : '.env';

const result = dotenv.config({ path: path.resolve(process.cwd(), envFile) });

if (result.error && NODE_ENV !== 'production') {
  throw new Error(
    `[ENV] Failed to load ${envFile}. Did you copy .env.example to .env?\n${result.error.message}`
  );
}

// ─────────────────────────────────────────────────────────
// Validated & exported configuration object.
// All code in the project reads from here — never from process.env directly.
// This single point of truth makes it trivial to audit what variables the app uses.
// ─────────────────────────────────────────────────────────
const config = {
  env: NODE_ENV,
  isDevelopment: NODE_ENV === 'development',
  isProduction: NODE_ENV === 'production',
  isTest: NODE_ENV === 'test',

  server: {
    port: parseInt(process.env.PORT, 10) || 5000,
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
  },

  cors: {
    allowedOrigins: (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  },

  rateLimit: {
    windowMinutes: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES, 10) || 15,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  uploads: {
    maxFileSizeBytes: parseInt(process.env.MAX_FILE_SIZE_BYTES, 10) || 5242880,
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
  },
};

// ─────────────────────────────────────────────────────────
// Fail fast: if any required secret is missing in production,
// crash on startup rather than silently serving broken responses.
// ─────────────────────────────────────────────────────────
const REQUIRED_IN_PRODUCTION = ['database.url', 'auth.jwtSecret', 'auth.jwtRefreshSecret'];

if (config.isProduction) {
  REQUIRED_IN_PRODUCTION.forEach((keyPath) => {
    const keys = keyPath.split('.');
    const value = keys.reduce((obj, k) => obj?.[k], config);
    if (!value) {
      throw new Error(`[ENV] Missing required production environment variable: ${keyPath}`);
    }
  });
}

module.exports = config;
