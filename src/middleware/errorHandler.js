'use strict';

const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/AppError');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');
const config = require('../config/env');

// ─────────────────────────────────────────────────────────
// Global Error Handler Middleware
//
// This MUST be the last middleware registered in app.js.
// Express identifies error handlers by their 4-argument signature: (err, req, res, next).
//
// Error routing logic:
//   1. AppError (isOperational = true)  → known, expected failure → return structured JSON
//   2. Prisma known errors              → normalize to AppError → return structured JSON
//   3. JWT errors                       → normalize to AppError → return 401
//   4. Unknown errors (bugs)            → log full stack → return generic 500
//
// The `isOperational` flag is the dividing line between:
//   - "We anticipated this failure" (show the message to the client)
//   - "Something unexpected crashed" (hide internals, log for engineers)
// ─────────────────────────────────────────────────────────

// ─── Normalize Prisma Errors ──────────────────────────────
// Prisma throws typed errors that map cleanly to HTTP semantics.
// We intercept them here so individual controllers never need to handle them.
const handlePrismaError = (err) => {
  // P2002: Unique constraint violation (e.g., duplicate email)
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    return new AppError(`A record with this ${field} already exists.`, StatusCodes.CONFLICT);
  }

  // P2025: Record not found (e.g., update/delete on non-existent ID)
  if (err.code === 'P2025') {
    return new AppError('The requested record was not found.', StatusCodes.NOT_FOUND);
  }

  // P2003: Foreign key constraint violation
  if (err.code === 'P2003') {
    return new AppError(
      'Operation failed due to a related record constraint.',
      StatusCodes.BAD_REQUEST
    );
  }

  // P2014: Relation violation
  if (err.code === 'P2014') {
    return new AppError('Invalid relation in the request.', StatusCodes.BAD_REQUEST);
  }

  // Default Prisma error — treat as a 500
  return new AppError('A database error occurred.', StatusCodes.INTERNAL_SERVER_ERROR);
};

// ─── Normalize JWT Errors ─────────────────────────────────
const handleJwtError = () =>
  new AppError('Invalid or expired token. Please log in again.', StatusCodes.UNAUTHORIZED);

// ─── Global Error Handler ─────────────────────────────────
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  let error = err;

  // ── Normalize known third-party error types ──────────────
  if (err.name === 'PrismaClientKnownRequestError' || err.code?.startsWith('P')) {
    error = handlePrismaError(err);
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    error = handleJwtError();
  }

  // ── Determine final status code ──────────────────────────
  const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const isOperational = error.isOperational === true;

  // ── Log strategy ─────────────────────────────────────────
  if (isOperational) {
    // Known operational errors: log at warn level (not a bug)
    logger.warn(`[${req.method}] ${req.originalUrl} → ${statusCode}: ${error.message}`);
  } else {
    // Unexpected errors: log full stack for engineering investigation
    logger.error(`[UNHANDLED ERROR] ${req.method} ${req.originalUrl}`, {
      message: error.message,
      stack: error.stack,
      body: req.body,
    });
  }

  // ── Build response ────────────────────────────────────────
  const message = isOperational
    ? error.message
    : config.isProduction
      ? 'An unexpected error occurred. Please try again later.'
      : error.message; // Show real message in development for faster debugging

  return ApiResponse.error(res, {
    statusCode,
    message,
    errors: error.errors || null,
  });
};

// ─────────────────────────────────────────────────────────
// 404 Handler
//
// Catches requests to routes that do not exist.
// Must be registered AFTER all valid routes but BEFORE the error handler.
// ─────────────────────────────────────────────────────────
const notFound = (req, _res, next) => {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl}`, StatusCodes.NOT_FOUND));
};

module.exports = { errorHandler, notFound };
