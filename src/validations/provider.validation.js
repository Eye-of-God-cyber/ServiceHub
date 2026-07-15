'use strict';

const { body } = require('express-validator');
const { sanitizePlainText } = require('../utils/sanitize.util');

// ─────────────────────────────────────────────────────────────────────────────
// updateProviderProfileValidation
//
// All fields optional — supports partial updates.
// Immutable fields (verificationStatus, avgRating, totalReviews, totalBookings,
// wallet, role) are hard-blocked with .not().exists() so clients receive an
// explicit, actionable error message rather than a silent ignore.
// ─────────────────────────────────────────────────────────────────────────────
const updateProviderProfileValidation = [
  body('bio')
    .optional({ nullable: true })
    .trim()
    .customSanitizer(sanitizePlainText)
    .isLength({ max: 1000 })
    .withMessage('Bio cannot exceed 1000 characters'),

  body('experienceYears')
    .optional()
    .isInt({ min: 0, max: 60 })
    .withMessage('Experience years must be a whole number between 0 and 60')
    .toInt(),

  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean (true or false)')
    .toBoolean(),

  body('avatarUrl')
    .optional({ nullable: true })
    .trim()
    .isURL({ require_protocol: true, protocols: ['http', 'https'] })
    .withMessage('Avatar URL must be a valid http/https URL')
    .isLength({ max: 512 })
    .withMessage('Avatar URL cannot exceed 512 characters'),

  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),

  // ── Hard-block immutable / system-managed fields ──────────────────────────
  body('verificationStatus')
    .not().exists()
    .withMessage('verificationStatus is managed by admins and cannot be updated here'),

  body('avgRating')
    .not().exists()
    .withMessage('avgRating is system-calculated and cannot be updated'),

  body('totalReviews')
    .not().exists()
    .withMessage('totalReviews is system-calculated and cannot be updated'),

  body('totalBookings')
    .not().exists()
    .withMessage('totalBookings is system-calculated and cannot be updated'),

  body('role')
    .not().exists()
    .withMessage('Role cannot be changed through this endpoint'),

  body('wallet')
    .not().exists()
    .withMessage('Wallet cannot be updated through this endpoint'),

  body('userId')
    .not().exists()
    .withMessage('userId is a protected field'),
];

module.exports = { updateProviderProfileValidation };
