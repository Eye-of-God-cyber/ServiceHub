'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// Role Constants
//
// Single source of truth for all role names in the system.
// Matches the RoleName enum in schema.prisma exactly.
//
// Usage in any route or middleware:
//   const { ROLES } = require('../config/roles');
//   router.get('/admin/dashboard', authenticate, authorize(ROLES.ADMIN), handler);
//   router.post('/bookings',       authenticate, authorize(ROLES.CUSTOMER), handler);
// ─────────────────────────────────────────────────────────────────────────────

const ROLES = Object.freeze({
  ADMIN:    'ADMIN',
  PROVIDER: 'PROVIDER',
  CUSTOMER: 'CUSTOMER',
});

module.exports = { ROLES };
