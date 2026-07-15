'use strict';

const jwt = require('jsonwebtoken');
const { JWT_EXPIRES_IN } = require('../config/auth.constants');
const { InvalidTokenError, ExpiredTokenError } = require('../errors/auth.error');

/**
 * Generates an Access Token for a given payload (usually containing user id/roles).
 * 
 * @param {Object} payload - Data to embed in the token.
 * @returns {string} Signed JWT.
 */
const generateAccessToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is missing.');
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verifies a given token string synchronously.
 * Translates standard jsonwebtoken errors into custom application AppErrors.
 * 
 * @param {string} token - The JWT string to verify.
 * @returns {Object} Decoded payload if successful.
 * @throws {ExpiredTokenError|InvalidTokenError}
 */
const verifyAccessToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is missing.');
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ExpiredTokenError();
    }
    throw new InvalidTokenError();
  }
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
};
