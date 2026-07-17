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
 *     summary: Get all reviews (public — no auth required)
 *     tags: [Reviews]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: providerId
 *         schema:
 *           type: integer
 *         description: Filter reviews by provider ID
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *         description: Filter reviews by customer ID
 *     responses:
 *       200:
 *         description: Reviews returned successfully
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
 *     summary: Create a review for a completed booking (CUSTOMER only)
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookingId, rating]
 *             properties:
 *               bookingId:
 *                 type: integer
 *                 example: 1
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Excellent service! Very professional."
 *     responses:
 *       201:
 *         description: Review created successfully
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
 *     summary: Reply to a review (PROVIDER only)
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [comment]
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "Thank you for the kind words!"
 *     responses:
 *       201:
 *         description: Reply created successfully
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
