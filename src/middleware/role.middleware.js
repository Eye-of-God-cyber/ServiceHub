'use strict';

const { ROLES } = require('../config/roles');
const { UnauthorizedError, ForbiddenError } = require('../errors/auth.error');

// ─────────────────────────────────────────────────────────────────────────────
// authorize(...allowedRoles)
//
// Role-Based Access Control middleware factory.
// Must always be placed AFTER `authenticate` in the route middleware chain.
//
// How it works:
//   1. authenticate runs first — verifies JWT, loads user from DB, attaches req.user
//   2. authorize runs second — reads req.user.userRoles, compares against allowedRoles
//   3. If the user's role is in allowedRoles → next()
//   4. Otherwise → throws ForbiddenError (403)
//
// Usage examples:
//   router.get('/admin/dashboard',           authenticate, authorize(ROLES.ADMIN),              handler);
//   router.post('/bookings',                 authenticate, authorize(ROLES.CUSTOMER),            handler);
//   router.patch('/providers/:id/availability', authenticate, authorize(ROLES.PROVIDER),         handler);
//   router.get('/notifications',             authenticate, authorize(ROLES.ADMIN, ROLES.PROVIDER, ROLES.CUSTOMER), handler);
//   router.get('/admin/providers',           authenticate, authorize(ROLES.ADMIN, ROLES.PROVIDER), handler);
//
// @param {...string} allowedRoles - One or more role names from ROLES constant.
// @returns {Function} Express middleware (req, res, next)
// ─────────────────────────────────────────────────────────────────────────────

const authorize = (...allowedRoles) => {
  // Validate at definition time — catch typos in route files during startup,
  // not during a live request. If an unknown role is passed to authorize(),
  // blow up immediately so the developer is alerted.
  const validRoles = Object.values(ROLES);
  for (const role of allowedRoles) {
    if (!validRoles.includes(role)) {
      throw new Error(
        `[authorize] Unknown role "${role}" passed to middleware. Valid roles: ${validRoles.join(', ')}`
      );
    }
  }

  return (req, _res, next) => {
    // 1. Ensure authenticate ran before this middleware.
    //    req.user is attached by auth.middleware.js — if it's missing, the
    //    middleware chain was configured incorrectly.
    if (!req.user) {
      throw new UnauthorizedError(
        'Authentication is required before authorization. Ensure authenticate middleware runs first.'
      );
    }

    // 2. Extract the user's roles from the database record attached by authenticate.
    //    We read from req.user.userRoles (DB source), never from the JWT payload.
    //    This prevents privilege escalation via a tampered token.
    const userRoleNames = req.user.userRoles.map((ur) => ur.role.name);

    if (userRoleNames.length === 0) {
      // Edge case: authenticated user has no role assigned — this should not
      // happen in normal operation but must be handled defensively.
      throw new ForbiddenError('Your account has no role assigned. Please contact support.');
    }

    // 3. Check for intersection: does the user hold at least one allowed role?
    const hasPermission = allowedRoles.some((role) => userRoleNames.includes(role));

    if (!hasPermission) {
      throw new ForbiddenError(
        `Access denied. Required role(s): [${allowedRoles.join(', ')}]. Your role: [${userRoleNames.join(', ')}].`
      );
    }

    // 4. All good — hand off to the next middleware / controller.
    next();
  };
};

module.exports = authorize;
