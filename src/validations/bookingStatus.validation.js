'use strict';

const { body } = require('express-validator');
const { BookingStatus } = require('@prisma/client');
const { sanitizePlainText } = require('../utils/sanitize.util');

const updateBookingStatusValidation = [
  body('status')
    .trim().notEmpty().withMessage('Status is required')
    .isIn(Object.values(BookingStatus))
    .withMessage('Invalid status'),
  body('cancellationReason')
    .optional({ nullable: true })
    .trim()
    .customSanitizer(sanitizePlainText)
    .isLength({ max: 255 }).withMessage('Cancellation reason cannot exceed 255 characters'),
];

module.exports = {
  updateBookingStatusValidation,
};
