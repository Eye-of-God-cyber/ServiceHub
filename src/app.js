'use strict';

// ─────────────────────────────────────────────────────────
// app.js — Express Application Factory
//
// This file creates and configures the Express application.
// It does NOT start the HTTP server — that is server.js's responsibility.
//
// Why separate app.js from server.js?
// - Testing: test suites can import app.js and use supertest without
//   binding a port, avoiding "address already in use" conflicts.
// - Clarity: app.js is purely about middleware and routing.
//   server.js is purely about process-level concerns (listening, signals).
// ─────────────────────────────────────────────────────────

require('express-async-errors'); // Must be required before express routes

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');

const config = require('./config/env');
const swaggerSpec = require('./config/swagger');
const requestLogger = require('./middleware/requestLogger');
const { globalLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const apiRoutes = require('./routes/index');

const app = express();

// ─────────────────────────────────────────────────────────
// 1. Security Headers (Helmet)
//    Must be applied before any route handler.
//    Helmet sets ~14 security-related HTTP headers (X-Frame-Options,
//    Content-Security-Policy, etc.) to harden the API against common
//    web vulnerabilities.
// ─────────────────────────────────────────────────────────
app.use(helmet());

// ─────────────────────────────────────────────────────────
// 2. CORS
//    Restricts which origins can make cross-origin requests.
//    Credentials (cookies) are supported for refresh token flow.
// ─────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) {
        return callback(null, true);
      }
      if (config.cors.allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: Origin '${origin}' is not allowed.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─────────────────────────────────────────────────────────
// 3. Body Parsers
// ─────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));       // Parse JSON bodies (cap at 10KB to prevent payload bombs)
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());                        // Parse Cookie header for refresh token handling

// ─────────────────────────────────────────────────────────
// 4. HTTP Parameter Pollution Prevention
//    Prevents attackers from submitting duplicate query parameters
//    (e.g., ?sort=asc&sort=desc) to confuse downstream middleware.
// ─────────────────────────────────────────────────────────
app.use(hpp());

// ─────────────────────────────────────────────────────────
// 5. Request Logging
// ─────────────────────────────────────────────────────────
app.use(requestLogger);

// ─────────────────────────────────────────────────────────
// 6. Global Rate Limiter
//    Applied to all /api routes. Auth-specific stricter limiter
//    is applied at the individual auth router level.
// ─────────────────────────────────────────────────────────
app.use('/api', globalLimiter);

// ─────────────────────────────────────────────────────────
// 7. API Documentation (Swagger UI)
//    Available at /api-docs — accessible only in non-production,
//    or can be protected behind an admin route in production.
// ─────────────────────────────────────────────────────────
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'ServiceHub API Docs',
    swaggerOptions: {
      persistAuthorization: true, // Remember the JWT token between page refreshes
    },
  })
);

// Expose the raw OpenAPI JSON spec for external tooling (Postman import, etc.)
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ─────────────────────────────────────────────────────────
// 8. API Routes
// ─────────────────────────────────────────────────────────
app.use('/api/v1', apiRoutes);

// ─────────────────────────────────────────────────────────
// 9. Root Route — Brief API welcome (useful for quick sanity checks)
// ─────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    name: 'ServiceHub API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/api/v1/health',
  });
});

// ─────────────────────────────────────────────────────────
// 10. 404 Handler (must come after all valid routes)
// ─────────────────────────────────────────────────────────
app.use(notFound);

// ─────────────────────────────────────────────────────────
// 11. Global Error Handler (must be last — 4-arg signature)
// ─────────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
