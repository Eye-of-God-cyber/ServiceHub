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
 *     summary: Create a new booking (CUSTOMER only)
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [providerServiceId, addressId, scheduledAt]
 *             properties:
 *               providerServiceId:
 *                 type: integer
 *                 example: 1
 *               addressId:
 *                 type: integer
 *                 example: 1
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-30T10:00:00.000Z"
 *               notes:
 *                 type: string
 *                 example: "Please bring extra tools"
 *               couponId:
 *                 type: integer
 *                 example: null
 *     responses:
 *       201:
 *         description: Booking created successfully
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
 *     summary: Get all bookings for the authenticated user
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW]
 *         description: Filter bookings by status
 *     responses:
 *       200:
 *         description: Bookings returned successfully
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
 *     summary: Get a single booking by ID
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Booking returned successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
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
 *     summary: Update the status of a booking
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW]
 *                 example: CONFIRMED
 *               cancellationReason:
 *                 type: string
 *                 example: "Customer not available"
 *     responses:
 *       200:
 *         description: Booking status updated successfully
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
