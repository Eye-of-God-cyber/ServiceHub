'use strict';

const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./env');

// ─────────────────────────────────────────────────────────
// Swagger / OpenAPI 3.0 Configuration
//
// swagger-jsdoc reads JSDoc comments from route files and merges them
// with this base definition to produce a complete OpenAPI specification.
//
// We separate the configuration here so the spec definition is not
// buried inside app.js and can be imported independently for testing.
// ─────────────────────────────────────────────────────────

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'ServiceHub API',
    version: '1.0.0',
    description:
      'REST API documentation for the ServiceHub Multi-Vendor Home Services Marketplace. ' +
      'All protected endpoints require a Bearer token in the Authorization header.',
    contact: {
      name: 'ServiceHub Engineering',
      email: 'engineering@servicehub.app',
    },
    license: {
      name: 'ISC',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.server.port}/api/v1`,
      description: 'Local Development Server',
    },
    {
      url: 'https://api.servicehub.app/api/v1',
      description: 'Production Server',
    },
  ],
  // ─── Reusable security scheme ─────────────────────────
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token',
      },
    },
    // Reusable response schemas will be added here as modules are built.
    schemas: {},
    responses: {
      UnauthorizedError: {
        description: 'Access token is missing or invalid',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Unauthorized' },
              },
            },
          },
        },
      },
      ForbiddenError: {
        description: 'Authenticated but not authorized to perform this action',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Forbidden' },
              },
            },
          },
        },
      },
      NotFoundError: {
        description: 'The requested resource was not found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Resource not found' },
              },
            },
          },
        },
      },
      ValidationError: {
        description: 'Request body failed validation',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Validation failed' },
                errors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: { type: 'string' },
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  // Global security — every route requires Bearer auth unless overridden.
  security: [{ BearerAuth: [] }],
  tags: [
    { name: 'Health', description: 'API health and status' },
    { name: 'Auth', description: 'Authentication — register, login, refresh, logout' },
    { name: 'Users', description: 'Customer profile management' },
    { name: 'Providers', description: 'Provider profile, availability, and services' },
    { name: 'Admin', description: 'Admin-only operations' },
    { name: 'Categories', description: 'Service categories' },
    { name: 'Services', description: 'Service catalog' },
    { name: 'Bookings', description: 'Booking lifecycle management' },
    { name: 'Payments', description: 'Payments and wallet' },
    { name: 'Reviews', description: 'Reviews and ratings' },
    { name: 'Disputes', description: 'Dispute management' },
    { name: 'Notifications', description: 'User notifications' },
    { name: 'Coupons', description: 'Coupon management' },
  ],
};

// ─── swagger-jsdoc options ────────────────────────────────
const swaggerOptions = {
  definition: swaggerDefinition,
  // Glob pattern to discover all route files with JSDoc @swagger annotations.
  // Route files follow the naming convention: src/modules/<name>/<name>.routes.js
  // e.g. auth/auth.routes.js, bookings/booking.routes.js, etc.
  apis: ['./src/modules/**/*.routes.js'],
};

// Build the compiled spec at startup time (not on every request).
const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
