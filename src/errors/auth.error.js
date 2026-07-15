'use strict';

const AppError = require('../utils/AppError');
const { StatusCodes } = require('http-status-codes');

/**
 * Thrown when no token or an invalid token is provided.
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

/**
 * Thrown when the token signature is invalid or malformed.
 */
class InvalidTokenError extends AppError {
  constructor(message = 'Invalid authentication token') {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

/**
 * Thrown when the token has expired.
 */
class ExpiredTokenError extends AppError {
  constructor(message = 'Authentication token has expired') {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

/**
 * Thrown when an authenticated user attempts to access a resource
 * they do not have sufficient roles/permissions for.
 */
class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, StatusCodes.FORBIDDEN);
  }
}

module.exports = {
  UnauthorizedError,
  InvalidTokenError,
  ExpiredTokenError,
  ForbiddenError,
};
