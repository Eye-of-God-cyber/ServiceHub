'use strict';

const rateLimit = require('express-rate-limit');
const config = require('../config/env');
const AppError = require('../utils/AppError');

// ─────────────────────────────────────────────────────────
// Rate Limiter Middleware
//
// Protects the API from brute-force and denial-of-service attacks
// by limiting the number of requests a single IP can make within
// a rolling time window.
//
// We export two limiters:
//   1. `globalLimiter`  — Applied to all routes (generous limit)
//   2. `authLimiter`    — Applied only to /auth routes (strict limit)
//      Brute-forcing login with 1000 requests is far more dangerous
//      than browsing the catalog 1000 times.
// ─────────────────────────────────────────────────────────

const globalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMinutes * 60 * 1000,
  max: config.rateLimit.maxRequests,
  standardHeaders: true, // Return `RateLimit-*` headers
  legacyHeaders: false,  // Disable deprecated `X-RateLimit-*` headers
  handler: (_req, _res, next) => {
    next(
      new AppError(
        `Too many requests from this IP. Please try again after ${config.rateLimit.windowMinutes} minutes.`,
        429
      )
    );
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Fixed 15-minute window for auth routes
  max: 20,                   // 20 attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(
      new AppError(
        'Too many authentication attempts from this IP. Please try again after 15 minutes.',
        429
      )
    );
  },
});

module.exports = { globalLimiter, authLimiter };
