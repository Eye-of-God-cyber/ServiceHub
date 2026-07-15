'use strict';

const { body } = require('express-validator');

// ─────────────────────────────────────────────────────────────────────────────
// updateProfileValidation
//
// Every field is optional (partial update / PATCH semantics on a PUT route).
// We validate only the fields that are actually provided.
// Fields like email, role, status, wallet are intentionally absent —
// they must never be updatable through this endpoint.
// ─────────────────────────────────────────────────────────────────────────────

const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('First name cannot be empty')
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),

  body('lastName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Last name cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),

  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid ISO 8601 date (YYYY-MM-DD)')
    .toDate(),

  body('avatarUrl')
    .optional({ nullable: true })
    .trim()
    .isURL({ require_protocol: true, protocols: ['http', 'https'] })
    .withMessage('Avatar URL must be a valid http/https URL')
    .isLength({ max: 512 })
    .withMessage('Avatar URL cannot exceed 512 characters'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Phone must be a valid 10-digit Indian mobile number starting with 6-9'),

  // Reject attempts to write immutable / protected fields
  body('email').not().exists().withMessage('Email cannot be updated through this endpoint'),
  body('role').not().exists().withMessage('Role cannot be updated through this endpoint'),
  body('status').not().exists().withMessage('Status cannot be updated through this endpoint'),
  body('password').not().exists().withMessage('Use the change-password endpoint to update your password'),
  body('passwordHash').not().exists().withMessage('passwordHash is a protected field'),
  body('verificationStatus').not().exists().withMessage('verificationStatus is managed by admin'),
  body('wallet').not().exists().withMessage('Wallet cannot be updated through this endpoint'),
];

module.exports = { updateProfileValidation };
