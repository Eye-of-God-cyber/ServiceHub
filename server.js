'use strict';

// ─────────────────────────────────────────────────────────
// server.js — Process Entry Point
//
// This file is responsible for:
//   1. Starting the HTTP server on the configured port.
//   2. Handling graceful shutdown (SIGTERM, SIGINT) so in-flight
//      requests complete before the process exits.
//   3. Catching any unhandled promise rejections or uncaught exceptions
//      that slip past the Express error handler — these represent bugs.
//
// It intentionally contains NO business logic or Express configuration.
// All of that lives in src/app.js.
// ─────────────────────────────────────────────────────────

const app = require('./src/app');
const config = require('./src/config/env');
const logger = require('./src/utils/logger');
const prisma = require('./src/config/prisma');

const PORT = config.server.port;

// ─── Start Server ─────────────────────────────────────────
const server = app.listen(PORT, () => {
  logger.info('─────────────────────────────────────────────');
  logger.info(`  ServiceHub API`);
  logger.info(`  Environment : ${config.env}`);
  logger.info(`  Port        : ${PORT}`);
  logger.info(`  Docs        : http://localhost:${PORT}/api-docs`);
  logger.info(`  Health      : http://localhost:${PORT}/api/v1/health`);
  logger.info('─────────────────────────────────────────────');
});

// ─── Graceful Shutdown ────────────────────────────────────
//
// When a deployment platform (Kubernetes, Railway, Render) wants to
// stop the process, it sends SIGTERM. We catch it, stop accepting new
// connections, wait for in-flight requests to finish, then disconnect
// from the database cleanly before exiting.
//
// Without this, abrupt process termination can leave database
// transactions half-committed or connections dangling.

const gracefulShutdown = async (signal) => {
  logger.info(`[Server] ${signal} received. Initiating graceful shutdown...`);

  server.close(async () => {
    logger.info('[Server] HTTP server closed. No new connections accepted.');

    try {
      await prisma.$disconnect();
      logger.info('[Server] Prisma client disconnected.');
      logger.info('[Server] Shutdown complete. Exiting process.');
      process.exit(0);
    } catch (error) {
      logger.error('[Server] Error during Prisma disconnect:', { error: error.message });
      process.exit(1);
    }
  });

  // Force-exit after 10 seconds if graceful shutdown hangs
  setTimeout(() => {
    logger.error('[Server] Graceful shutdown timed out. Forcing exit.');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ─── Unhandled Rejections & Exceptions ───────────────────
//
// These are bugs — log them at the highest severity and exit.
// A process manager (PM2, Docker, Kubernetes) will restart the process.
// We do NOT try to recover from these; an unknown state is dangerous.

process.on('unhandledRejection', (reason, promise) => {
  logger.error('[Process] Unhandled Promise Rejection', {
    promise,
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined,
  });
  // Crash the process — let the process manager restart it in a clean state
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('[Process] Uncaught Exception — shutting down', {
    message: error.message,
    stack: error.stack,
  });
  process.exit(1);
});
