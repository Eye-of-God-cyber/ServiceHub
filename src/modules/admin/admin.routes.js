'use strict';

const express = require('express');
const router  = express.Router();

const adminController = require('./admin.controller');
const authenticate    = require('../../middleware/auth.middleware');
const authorize       = require('../../middleware/role.middleware');
const validate        = require('../../middleware/validate');
const { docIdParam, disputeIdParam, updateDocStatusValidation, resolveDisputeValidation } = require('../../validations/admin.validation');
const { ROLES } = require('../../config/roles');

// All endpoints require ADMIN role
router.use(authenticate, authorize(ROLES.ADMIN));

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /admin/documents/{docId}/status:
 *   patch:
 *     summary: Approve or reject a provider verification document (ADMIN only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: docId
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
 *                 enum: [APPROVED, REJECTED]
 *                 example: APPROVED
 *               adminNotes:
 *                 type: string
 *                 example: "Document verified successfully."
 *     responses:
 *       200:
 *         description: Document status updated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
// PATCH /api/v1/admin/documents/:docId/status
// ─────────────────────────────────────────────────────────────────────────────
router.patch(
  '/documents/:docId/status',
  docIdParam,
  updateDocStatusValidation,
  validate,
  adminController.updateDocumentStatus
);

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /admin/disputes/{disputeId}/resolve:
 *   patch:
 *     summary: Resolve a dispute with an admin decision (ADMIN only)
 *     tags: [Admin]
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
 *             required: [resolution]
 *             properties:
 *               resolution:
 *                 type: string
 *                 example: "After reviewing both sides, the refund has been issued to the customer."
 *     responses:
 *       200:
 *         description: Dispute resolved successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
// PATCH /api/v1/admin/disputes/:disputeId/resolve
// ─────────────────────────────────────────────────────────────────────────────
router.patch(
  '/disputes/:disputeId/resolve',
  disputeIdParam,
  resolveDisputeValidation,
  validate,
  adminController.resolveDispute
);

module.exports = router;
