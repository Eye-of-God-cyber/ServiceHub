'use strict';

const express = require('express');
const router  = express.Router();

const disputeController = require('./dispute.controller');
const authenticate      = require('../../middleware/auth.middleware');
const authorize         = require('../../middleware/role.middleware');
const validate          = require('../../middleware/validate');
const { createDisputeValidation, addMessageValidation, disputeIdParam } = require('../../validations/dispute.validation');
const { ROLES } = require('../../config/roles');

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /disputes:
 *   get:
 *     summary: Get all disputes for the authenticated user
 *     tags: [Disputes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Disputes returned successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
// GET /api/v1/disputes
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  '/',
  authenticate,
  authorize(ROLES.CUSTOMER, ROLES.PROVIDER, ROLES.ADMIN),
  disputeController.getDisputes
);

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /disputes/{disputeId}:
 *   get:
 *     summary: Get a single dispute by ID
 *     tags: [Disputes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: disputeId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Dispute returned successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
// GET /api/v1/disputes/:disputeId
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  '/:disputeId',
  authenticate,
  authorize(ROLES.CUSTOMER, ROLES.PROVIDER, ROLES.ADMIN),
  disputeIdParam,
  validate,
  disputeController.getDisputeById
);

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /disputes:
 *   post:
 *     summary: Open a new dispute for a booking (CUSTOMER or PROVIDER)
 *     tags: [Disputes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookingId, subject, description]
 *             properties:
 *               bookingId:
 *                 type: integer
 *                 example: 1
 *               subject:
 *                 type: string
 *                 example: "Provider did not show up"
 *               description:
 *                 type: string
 *                 example: "The provider confirmed the booking but never arrived at the scheduled time."
 *     responses:
 *       201:
 *         description: Dispute created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
// POST /api/v1/disputes
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/',
  authenticate,
  authorize(ROLES.CUSTOMER, ROLES.PROVIDER),
  createDisputeValidation,
  validate,
  disputeController.createDispute
);

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /disputes/{disputeId}/messages:
 *   post:
 *     summary: Add a message to an existing dispute
 *     tags: [Disputes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: disputeId
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
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *                 example: "I have attached the proof of service below."
 *     responses:
 *       201:
 *         description: Message added successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
// POST /api/v1/disputes/:disputeId/messages
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/:disputeId/messages',
  authenticate,
  authorize(ROLES.CUSTOMER, ROLES.PROVIDER, ROLES.ADMIN),
  disputeIdParam,
  addMessageValidation,
  validate,
  disputeController.addDisputeMessage
);

module.exports = router;
