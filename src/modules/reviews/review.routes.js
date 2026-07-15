'use strict';

const express = require('express');
const router  = express.Router();

const reviewController = require('./review.controller');
const authenticate     = require('../../middleware/auth.middleware');
const authorize        = require('../../middleware/role.middleware');
const validate         = require('../../middleware/validate');
const { createReviewValidation, createReplyValidation, reviewIdParam, listReviewsValidation } = require('../../validations/review.validation');
const { ROLES } = require('../../config/roles');

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: GET /reviews
 *     tags: [reviews]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
// GET /api/v1/reviews
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  '/',
  listReviewsValidation,
  validate,
  reviewController.getReviews
);

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: POST /reviews
 *     tags: [reviews]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
// POST /api/v1/reviews
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/',
  authenticate,
  authorize(ROLES.CUSTOMER),
  createReviewValidation,
  validate,
  reviewController.createReview
);

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /reviews/{reviewId}/reply:
 *   post:
 *     summary: POST /reviews/{reviewId}/reply
 *     tags: [reviews]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
// POST /api/v1/reviews/:reviewId/reply
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/:reviewId/reply',
  authenticate,
  authorize(ROLES.PROVIDER),
  reviewIdParam,
  createReplyValidation,
  validate,
  reviewController.createReviewReply
);

module.exports = router;
