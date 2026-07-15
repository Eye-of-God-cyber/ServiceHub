'use strict';

/**
 * Authentication Constants
 * Centralizes all magic strings and hardcoded numbers related to auth.
 */
module.exports = {
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  HEADER_NAME: 'authorization',
  BEARER_PREFIX: 'Bearer ',
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS, 10) || 12,
  COOKIE_NAME: 'refreshToken',
};
