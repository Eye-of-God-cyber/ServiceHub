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
/**
 * @swagger
 * /providers/documents:
 *   get:
 *     summary: GET /providers/documents
 *     tags: [Providers]
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
router.get('/documents', authenticate, authorize(ROLES.PROVIDER), async (req, res) => {
  const docs = await docService.getDocuments(req.user.id);
  res.json(new ApiResponse(StatusCodes.OK, docs, 'Documents fetched successfully'));
});
/**
 * @swagger
 * /providers/documents:
 *   post:
 *     summary: POST /providers/documents
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Document submitted successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/documents', authenticate, authorize(ROLES.PROVIDER), createDocumentValidation, validate, async (req, res) => {
  const doc = await docService.createDocument(req.user.id, req.body);
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, doc, 'Document submitted successfully'));
});
/**
 * @swagger
 * /providers/documents/{docId}:
 *   delete:
 *     summary: DELETE /providers/documents/{docId}
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: docId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/documents/:docId', authenticate, authorize(ROLES.PROVIDER), docIdParam, validate, async (req, res) => {
  await docService.deleteDocument(req.user.id, req.params.docId);
  res.json(new ApiResponse(StatusCodes.OK, null, 'Document deleted successfully'));
});

// ─────────────────────────────────────────────────────────────────────────────
// Provider Availability (5C)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /providers/availability:
 *   get:
 *     summary: GET /providers/availability
 *     tags: [Providers]
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
router.get('/availability', authenticate, authorize(ROLES.PROVIDER), availabilityController.getAvailability);
/**
 * @swagger
 * /providers/availability:
 *   put:
 *     summary: PUT /providers/availability
 *     tags: [Providers]
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
router.put('/availability', authenticate, authorize(ROLES.PROVIDER), updateAvailabilityValidation, validate, availabilityController.updateAvailability);

// ─────────────────────────────────────────────────────────────────────────────
// Provider Time Off (5C)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /providers/time-off:
 *   get:
 *     summary: GET /providers/time-off
 *     tags: [Providers]
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
router.get('/time-off', authenticate, authorize(ROLES.PROVIDER), availabilityController.getTimeOffs);
/**
 * @swagger
 * /providers/time-off:
 *   post:
 *     summary: POST /providers/time-off
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Successful operation
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/time-off', authenticate, authorize(ROLES.PROVIDER), createTimeOffValidation, validate, availabilityController.createTimeOff);
/**
 * @swagger
 * /providers/time-off/{timeOffId}:
 *   delete:
 *     summary: DELETE /providers/time-off/{timeOffId}
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: timeOffId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/time-off/:timeOffId', authenticate, authorize(ROLES.PROVIDER), timeOffIdParam, validate, availabilityController.deleteTimeOff);

// ─────────────────────────────────────────────────────────────────────────────
// Provider Services (5D)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /providers/services:
 *   get:
 *     summary: GET /providers/services
 *     tags: [Providers]
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
router.get('/services', authenticate, authorize(ROLES.PROVIDER), psController.getProviderServices);
/**
 * @swagger
 * /providers/services:
 *   post:
 *     summary: POST /providers/services
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Successful operation
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/services', authenticate, authorize(ROLES.PROVIDER), createProviderServiceValidation, validate, psController.createProviderService);
/**
 * @swagger
 * /providers/services/{providerServiceId}:
 *   put:
 *     summary: PUT /providers/services/{providerServiceId}
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: providerServiceId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/services/:providerServiceId', authenticate, authorize(ROLES.PROVIDER), pSvcIdParam, updateProviderServiceValidation, validate, psController.updateProviderService);
/**
 * @swagger
 * /providers/services/{providerServiceId}:
 *   delete:
 *     summary: DELETE /providers/services/{providerServiceId}
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: providerServiceId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/services/:providerServiceId', authenticate, authorize(ROLES.PROVIDER), pSvcIdParam, validate, psController.deleteProviderService);

module.exports = router;
