'use strict';

// ─────────────────────────────────────────────────────────
// AppError — Custom Application Error Class
//
// We extend the native Error class so we can attach:
//   - statusCode: drives the HTTP response code
//   - isOperational: distinguishes known errors (validation failures,
//     "not found", "unauthorized") from genuine programming bugs.
//
// Why `isOperational`?
//   The global error handler uses this flag to decide whether to:
//   - Return a structured JSON response (operational = true)
//   - Log a full stack trace and return a generic 500 (operational = false)
//
// This pattern is recommended by the Node.js error handling best
// practices guide and Joyent's production error handling documentation.
// ─────────────────────────────────────────────────────────

class AppError extends Error {
  /**
   * @param {string} message       - Human-readable error message (sent in response)
   * @param {number} statusCode    - HTTP status code
   * @param {Array}  [errors=null] - Optional validation error details
   */
  constructor(message, statusCode, errors = null) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    // Capture a clean stack trace that excludes this constructor call,
    // so the stack starts from the actual throw site.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
