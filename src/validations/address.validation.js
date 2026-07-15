'use strict';

const { body, param } = require('express-validator');

// ─────────────────────────────────────────────────────────────────────────────
// Shared param validator — ensures :addressId is a positive integer
// ─────────────────────────────────────────────────────────────────────────────
const addressIdParam = [
  param('addressId')
    .isInt({ min: 1 })
    .withMessage('Address ID must be a positive integer')
    .toInt(),
];

// ─────────────────────────────────────────────────────────────────────────────
// createAddressValidation
// ─────────────────────────────────────────────────────────────────────────────
const createAddressValidation = [
  body('label')
    .optional()
    .trim()
    .isIn(['Home', 'Work', 'Other'])
    .withMessage("Label must be one of: Home, Work, Other"),

  body('line1')
    .trim()
    .notEmpty()
    .withMessage('Address line 1 is required')
    .isLength({ max: 150 })
    .withMessage('Address line 1 cannot exceed 150 characters'),

  body('line2')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 150 })
    .withMessage('Address line 2 cannot exceed 150 characters'),

  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ max: 80 })
    .withMessage('City cannot exceed 80 characters'),

  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required')
    .isLength({ max: 80 })
    .withMessage('State cannot exceed 80 characters'),

  body('pincode')
    .trim()
    .notEmpty()
    .withMessage('Pincode is required')
    .matches(/^\d{6}$/)
    .withMessage('Pincode must be a 6-digit Indian PIN code'),

  body('latitude')
    .optional({ nullable: true })
    .isDecimal()
    .withMessage('Latitude must be a valid decimal number'),

  body('longitude')
    .optional({ nullable: true })
    .isDecimal()
    .withMessage('Longitude must be a valid decimal number'),
];

// ─────────────────────────────────────────────────────────────────────────────
// updateAddressValidation — same rules but every field is optional
// ─────────────────────────────────────────────────────────────────────────────
const updateAddressValidation = [
  body('label')
    .optional()
    .trim()
    .isIn(['Home', 'Work', 'Other'])
    .withMessage("Label must be one of: Home, Work, Other"),

  body('line1')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Address line 1 cannot be empty')
    .isLength({ max: 150 })
    .withMessage('Address line 1 cannot exceed 150 characters'),

  body('line2')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 150 })
    .withMessage('Address line 2 cannot exceed 150 characters'),

  body('city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City cannot be empty')
    .isLength({ max: 80 })
    .withMessage('City cannot exceed 80 characters'),

  body('state')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('State cannot be empty')
    .isLength({ max: 80 })
    .withMessage('State cannot exceed 80 characters'),

  body('pincode')
    .optional()
    .trim()
    .matches(/^\d{6}$/)
    .withMessage('Pincode must be a 6-digit Indian PIN code'),

  body('latitude')
    .optional({ nullable: true })
    .isDecimal()
    .withMessage('Latitude must be a valid decimal number'),

  body('longitude')
    .optional({ nullable: true })
    .isDecimal()
    .withMessage('Longitude must be a valid decimal number'),

  // Hard-block client-supplied isDefault — use PATCH /:id/default instead
  body('isDefault')
    .not().exists()
    .withMessage('Use PATCH /addresses/:id/default to change the default address'),

  body('userId')
    .not().exists()
    .withMessage('userId is a protected field'),
];

module.exports = {
  addressIdParam,
  createAddressValidation,
  updateAddressValidation,
};
