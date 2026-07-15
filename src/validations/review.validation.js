'use strict';

const { body, param, query } = require('express-validator');
const { sanitizePlainText } = require('../utils/sanitize.util');

const createReviewValidation = [
  body('bookingId')
    .notEmpty().withMessage('bookingId is required')
    .isInt({ min: 1 }).withMessage('bookingId must be a positive integer')
    .toInt(),
  body('rating')
    .notEmpty().withMessage('rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('rating must be an integer between 1 and 5')
    .toInt(),
  body('comment')
    .optional({ nullable: true })
    .trim()
    .customSanitizer(sanitizePlainText)
    .isLength({ max: 1000 }).withMessage('comment cannot exceed 1000 characters'),
];

const createReplyValidation = [
  body('comment')
    .notEmpty().withMessage('comment is required')
    .trim()
    .customSanitizer(sanitizePlainText)
    .isLength({ max: 1000 }).withMessage('reply comment cannot exceed 1000 characters'),
];

const reviewIdParam = [
  param('reviewId').isInt({ min: 1 }).withMessage('reviewId must be a positive integer').toInt(),
];

const listReviewsValidation = [
  query('providerId')
    .optional()
    .isInt({ min: 1 }).withMessage('providerId must be a positive integer')
    .toInt(),
  query('customerId')
    .optional()
    .trim(),
];

module.exports = {
  createReviewValidation,
  createReplyValidation,
  reviewIdParam,
  listReviewsValidation,
};
