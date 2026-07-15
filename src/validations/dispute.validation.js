'use strict';

const { body, param } = require('express-validator');
const { sanitizePlainText } = require('../utils/sanitize.util');

const createDisputeValidation = [
  body('bookingId')
    .notEmpty().withMessage('bookingId is required')
    .isInt({ min: 1 }).withMessage('bookingId must be a positive integer').toInt(),
  body('subject')
    .notEmpty().withMessage('subject is required')
    .trim()
    .customSanitizer(sanitizePlainText)
    .isLength({ max: 255 }).withMessage('subject cannot exceed 255 characters'),
  body('description')
    .notEmpty().withMessage('description is required')
    .trim()
    .customSanitizer(sanitizePlainText)
    .isLength({ max: 2000 }).withMessage('description cannot exceed 2000 characters'),
];

const disputeIdParam = [
  param('disputeId').isInt({ min: 1 }).withMessage('disputeId must be a positive integer').toInt(),
];

const addMessageValidation = [
  body('message')
    .notEmpty().withMessage('message is required')
    .trim()
    .customSanitizer(sanitizePlainText)
    .isLength({ max: 2000 }).withMessage('message cannot exceed 2000 characters'),
];

module.exports = {
  createDisputeValidation,
  disputeIdParam,
  addMessageValidation,
};
