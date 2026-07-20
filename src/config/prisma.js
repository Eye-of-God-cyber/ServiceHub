'use strict';

const { PrismaClient } = require('@prisma/client');
const config = require('./env');
const logger = require('../utils/logger');

// ─────────────────────────────────────────────────────────
// Prisma Singleton Pattern
//
// We use a singleton to prevent Prisma from opening multiple database
// connection pools during development hot-reloads (nodemon restarts the
// module system, but global persists across reloads in the same process).
//
// In production, the module cache handles this naturally — this check
// is specifically for development safety.
// ─────────────────────────────────────────────────────────

const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    // Log every query in development so we can catch N+1 problems early.
    // In production, only log warnings and errors.
    log: config.isDevelopment
      ? [
          { emit: 'event', level: 'query' },
          { emit: 'event', level: 'warn' },
          { emit: 'event', level: 'error' },
        ]
      : [
          { emit: 'event', level: 'warn' },
          { emit: 'event', level: 'error' },
        ],
  });

// ─── Forward Prisma internal events to our Winston logger ─────────────────────

if (config.isDevelopment) {
  prisma.$on('query', (e) => {
    logger.debug(`[Prisma Query] ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms`);
  });
}

prisma.$on('warn', (e) => {
  logger.warn(`[Prisma Warning] ${e.message}`);
});

prisma.$on('error', (e) => {
  logger.error(`[Prisma Error] ${e.message}`);
});

// ─── Pin to global in development only ────────────────────────────────────────
if (config.isDevelopment) {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
