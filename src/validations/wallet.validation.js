'use strict';

const { query } = require('express-validator');

// ─────────────────────────────────────────────────────────
// Wallet Validation Rules
// ─────────────────────────────────────────────────────────

const getWalletValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100')
    .toInt(),
];

module.exports = { getWalletValidation };
