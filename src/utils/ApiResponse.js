'use strict';

// ─────────────────────────────────────────────────────────
// ApiResponse — Standardized HTTP Response Shape
//
// Every endpoint in the project uses this class to send responses.
// This guarantees a consistent envelope across the entire API:
//
//   Success:  { success: true,  message, data, meta }
//   Failure:  { success: false, message, errors }
//
// Why a class and not a plain function?
// - It is explicit about what shape a response will have.
// - Callers can add optional fields (like `meta` for pagination) cleanly.
// - The static factory methods keep controllers concise.
// ─────────────────────────────────────────────────────────

class ApiResponse {
  constructor(statusCode, data, message) {
    this.success = statusCode < 400;
    this.message = message;
    if (data !== undefined && data !== null) {
      this.data = data;
    }
  }

  /**
   * Send a successful response.
   *
   * @param {import('express').Response} res
   * @param {object} options
   * @param {number}  options.statusCode - HTTP status code (default: 200)
   * @param {string}  options.message    - Human-readable success message
   * @param {*}       [options.data]     - Payload to return
   * @param {object}  [options.meta]     - Pagination or extra metadata
   */
  static success(res, { statusCode = 200, message = 'Success', data = null, meta = null }) {
    const body = { success: true, message };
    if (data !== null) {
      body.data = data;
    }
    if (meta !== null) {
      body.meta = meta;
    }
    return res.status(statusCode).json(body);
  }

  /**
   * Send an error response.
   *
   * @param {import('express').Response} res
   * @param {object} options
   * @param {number}   options.statusCode - HTTP status code (default: 500)
   * @param {string}   options.message    - Human-readable error message
   * @param {Array}    [options.errors]   - Validation errors (field + message pairs)
   */
  static error(res, { statusCode = 500, message = 'Internal Server Error', errors = null }) {
    const body = { success: false, message };
    if (errors !== null) {
      body.errors = errors;
    }
    return res.status(statusCode).json(body);
  }
}

module.exports = ApiResponse;
