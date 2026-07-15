'use strict';

const express = require('express');
const router  = express.Router();

const bookingController = require('./booking.controller');
const authenticate      = require('../../middleware/auth.middleware');
const authorize         = require('../../middleware/role.middleware');
const validate          = require('../../middleware/validate');
const { createBookingValidation, listBookingsValidation, bookingIdParam } = require('../../validations/booking.validation');
const { updateBookingStatusValidation } = require('../../validations/bookingStatus.validation');
const { ROLES } = require('../../config/roles');

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: POST /bookings
 *     tags: [bookings]
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
// POST /api/v1/bookings
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/',
  authenticate,
  authorize(ROLES.CUSTOMER),
  createBookingValidation,
  validate,
  bookingController.createBooking
);

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: GET /bookings
 *     tags: [bookings]
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
// GET /api/v1/bookings
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  '/',
  authenticate,
  authorize(ROLES.CUSTOMER, ROLES.PROVIDER, ROLES.ADMIN),
  listBookingsValidation,
  validate,
  bookingController.getBookings
);

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /bookings/{bookingId}:
 *   get:
 *     summary: GET /bookings/{bookingId}
 *     tags: [bookings]
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
// GET /api/v1/bookings/:bookingId
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  '/:bookingId',
  authenticate,
  authorize(ROLES.CUSTOMER, ROLES.PROVIDER, ROLES.ADMIN),
  bookingIdParam,
  validate,
  bookingController.getBookingById
);

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /bookings/{bookingId}/status:
 *   patch:
 *     summary: PATCH /bookings/{bookingId}/status
 *     tags: [bookings]
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
// PATCH /api/v1/bookings/:bookingId/status
// ─────────────────────────────────────────────────────────────────────────────
router.patch(
  '/:bookingId/status',
  authenticate,
  authorize(ROLES.CUSTOMER, ROLES.PROVIDER, ROLES.ADMIN),
  bookingIdParam,
  updateBookingStatusValidation,
  validate,
  bookingController.updateBookingStatus
);

module.exports = router;
