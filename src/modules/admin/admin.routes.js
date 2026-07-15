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
 *     summary: PATCH /admin/documents/{docId}/status
 *     tags: [admin]
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
 *     summary: PATCH /admin/disputes/{disputeId}/resolve
 *     tags: [admin]
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
