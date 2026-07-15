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
 *     summary: GET /disputes
 *     tags: [disputes]
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
 *     summary: GET /disputes/{disputeId}
 *     tags: [disputes]
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
 *     summary: POST /disputes
 *     tags: [disputes]
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
 *     summary: POST /disputes/{disputeId}/messages
 *     tags: [disputes]
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
