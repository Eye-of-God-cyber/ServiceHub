'use strict';

const express = require('express');
const router  = express.Router();

const providerController = require('./provider.controller');
const docService         = require('./document.service');
const availabilityController = require('./availability.controller');
const psController       = require('./providerService.controller');
const authenticate       = require('../../middleware/auth.middleware');
const authorize          = require('../../middleware/role.middleware');
const validate           = require('../../middleware/validate');
const { updateProviderProfileValidation }              = require('../../validations/provider.validation');
const { docIdParam, createDocumentValidation }        = require('../../validations/document.validation');
const { updateAvailabilityValidation, createTimeOffValidation, timeOffIdParam } = require('../../validations/availability.validation');
const { pSvcIdParam, createProviderServiceValidation, updateProviderServiceValidation } = require('../../validations/providerService.validation');
const { ROLES } = require('../../config/roles');
const ApiResponse = require('../../utils/ApiResponse');
const { StatusCodes } = require('http-status-codes');

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /providers/me:
 *   get:
 *     summary: GET /providers/me
 *     tags: [providers]
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
// GET /api/v1/providers/me
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  '/me',
  authenticate,
  authorize(ROLES.PROVIDER),   // ADMIN and CUSTOMER receive 403
  providerController.getProviderProfile
);

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /providers/me:
 *   put:
 *     summary: PUT /providers/me
 *     tags: [providers]
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
// PUT /api/v1/providers/me
// ─────────────────────────────────────────────────────────────────────────────
router.put('/me', authenticate, authorize(ROLES.PROVIDER), updateProviderProfileValidation, validate, providerController.updateProviderProfile);

// ─────────────────────────────────────────────────────────────────────────────
// Provider Documents (5B)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/me/documents', authenticate, authorize(ROLES.PROVIDER), async (req, res) => {
  const docs = await docService.getDocuments(req.user.id);
  res.json(new ApiResponse(StatusCodes.OK, docs, 'Documents fetched successfully'));
});
router.post('/me/documents', authenticate, authorize(ROLES.PROVIDER), createDocumentValidation, validate, async (req, res) => {
  const doc = await docService.createDocument(req.user.id, req.body);
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, doc, 'Document submitted successfully'));
});
router.delete('/me/documents/:docId', authenticate, authorize(ROLES.PROVIDER), docIdParam, validate, async (req, res) => {
  await docService.deleteDocument(req.user.id, req.params.docId);
  res.json(new ApiResponse(StatusCodes.OK, null, 'Document deleted successfully'));
});

// ─────────────────────────────────────────────────────────────────────────────
// Provider Availability (5C)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/me/availability', authenticate, authorize(ROLES.PROVIDER), availabilityController.getAvailability);
router.put('/me/availability', authenticate, authorize(ROLES.PROVIDER), updateAvailabilityValidation, validate, availabilityController.updateAvailability);

// ─────────────────────────────────────────────────────────────────────────────
// Provider Time Off (5C)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/me/time-off', authenticate, authorize(ROLES.PROVIDER), availabilityController.getTimeOffs);
router.post('/me/time-off', authenticate, authorize(ROLES.PROVIDER), createTimeOffValidation, validate, availabilityController.createTimeOff);
router.delete('/me/time-off/:timeOffId', authenticate, authorize(ROLES.PROVIDER), timeOffIdParam, validate, availabilityController.deleteTimeOff);

// ─────────────────────────────────────────────────────────────────────────────
// Provider Services (5D)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/me/services', authenticate, authorize(ROLES.PROVIDER), psController.getProviderServices);
router.post('/me/services', authenticate, authorize(ROLES.PROVIDER), createProviderServiceValidation, validate, psController.createProviderService);
router.put('/me/services/:providerServiceId', authenticate, authorize(ROLES.PROVIDER), pSvcIdParam, updateProviderServiceValidation, validate, psController.updateProviderService);
router.delete('/me/services/:providerServiceId', authenticate, authorize(ROLES.PROVIDER), pSvcIdParam, validate, psController.deleteProviderService);

module.exports = router;
