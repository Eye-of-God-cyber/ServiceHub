'use strict';

const { body, param, query } = require('express-validator');
const { sanitizePlainText } = require('../utils/sanitize.util');

const createBookingValidation = [
  body('providerServiceId')
    .notEmpty().withMessage('providerServiceId is required')
    .isInt({ min: 1 }).withMessage('providerServiceId must be a positive integer')
    .toInt(),
  body('addressId')
    .notEmpty().withMessage('addressId is required')
    .isInt({ min: 1 }).withMessage('addressId must be a positive integer')
    .toInt(),
  body('scheduledAt')
    .notEmpty().withMessage('scheduledAt is required')
    .isISO8601().withMessage('scheduledAt must be a valid ISO8601 date')
    .toDate()
    .custom((val) => {
      if (val <= new Date()) {
        throw new Error('scheduledAt must be in the future');
      }
      return true;
    }),
  body('notes')
    .optional({ nullable: true })
    .trim()
    .customSanitizer(sanitizePlainText)
    .isLength({ max: 500 }).withMessage('notes cannot exceed 500 characters'),
  body('couponId')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('couponId must be a positive integer')
    .toInt(),
];

const bookingIdParam = [
  param('bookingId').isInt({ min: 1 }).withMessage('bookingId must be a positive integer').toInt(),
];

const listBookingsValidation = [
  query('status')
    .optional()
    .trim()
    .isIn(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])
    .withMessage('Invalid status filter'),
];

module.exports = {
  createBookingValidation,
  bookingIdParam,
  listBookingsValidation,
};
