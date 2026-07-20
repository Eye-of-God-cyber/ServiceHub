'use strict';

const { verifyAccessToken } = require('../utils/jwt.util');
const { UnauthorizedError, InvalidTokenError } = require('../errors/auth.error');
const prisma = require('../config/prisma');
const { HEADER_NAME, BEARER_PREFIX } = require('../config/auth.constants');

/**
 * Authentication Middleware
 * 
 * Responsibilities:
 * 1. Read Authorization header
 * 2. Extract Bearer token
 * 3. Verify JWT signature and expiry
 * 4. Load user from the database
 * 5. Attach the authenticated user object to the request (req.user)
 * 6. Propagate errors to the global error handler
 */
const authenticate = async (req, _res, next) => {
  // 1. Read Authorization Header
  const authHeader = req.headers[HEADER_NAME] || req.headers[HEADER_NAME.toLowerCase()];

  if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
    throw new UnauthorizedError('No authentication token provided');
  }

  // 2. Extract token
  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new InvalidTokenError();
  }

  // 3. Verify token (will throw ExpiredTokenError or InvalidTokenError if invalid)
  const decodedPayload = verifyAccessToken(token);

  // 4. Load user from database to ensure they still exist and are active
  const user = await prisma.user.findUnique({
    where: { id: decodedPayload.id },
    include: {
      userRoles: {
        include: { role: true },
      },
    },
  });

  if (!user) {
    throw new UnauthorizedError('The user belonging to this token no longer exists.');
  }

  if (user.status === 'SUSPENDED') {
    throw new UnauthorizedError('Your account has been suspended. Please contact support.');
  }

  if (user.status === 'INACTIVE') {
    throw new UnauthorizedError('Your account is currently inactive.');
  }

  // 5. Attach authenticated user to request
  req.user = user;

  next();
};

module.exports = authenticate;
