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
 *     summary: Get the authenticated provider's profile
 *     description: "🔒 Requires **PROVIDER** role. Login as `rajesh.kumar@gmail.com` / `Password@123`"
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Provider profile returned successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
// GET /api/v1/providers/me
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  '/me',
  authenticate,
  authorize(ROLES.PROVIDER),
  providerController.getProviderProfile
);

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /providers/me:
 *   put:
 *     summary: Update the authenticated provider's profile
 *     description: "🔒 Requires **PROVIDER** role. Login as `rajesh.kumar@gmail.com` / `Password@123`"
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *                 example: "Experienced plumber with 8 years of expertise."
 *               experienceYears:
 *                 type: integer
 *                 example: 8
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *               avatarUrl:
 *                 type: string
 *                 example: "https://example.com/avatar.png"
 *               firstName:
 *                 type: string
 *                 example: Ravi
 *               lastName:
 *                 type: string
 *                 example: Kumar
 *     responses:
 *       200:
 *         description: Provider profile updated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
// PUT /api/v1/providers/me
// ─────────────────────────────────────────────────────────────────────────────
router.put('/me', authenticate, authorize(ROLES.PROVIDER), updateProviderProfileValidation, validate, providerController.updateProviderProfile);

// ─────────────────────────────────────────────────────────────────────────────
// Provider Documents
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /providers/documents:
 *   get:
 *     summary: Get all documents submitted by the authenticated provider
 *     description: "🔒 Requires **PROVIDER** role. Login as `rajesh.kumar@gmail.com` / `Password@123`"
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Documents returned successfully
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
 *     summary: Submit a new verification document
 *     description: "🔒 Requires **PROVIDER** role. Login as `rajesh.kumar@gmail.com` / `Password@123`"
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [documentType, documentUrl]
 *             properties:
 *               documentType:
 *                 type: string
 *                 enum: [ID_PROOF, ADDRESS_PROOF, CERTIFICATION, POLICE_CLEARANCE, BUSINESS_LICENSE]
 *                 example: ID_PROOF
 *               documentUrl:
 *                 type: string
 *                 example: "https://example.com/docs/id.pdf"
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
 *     summary: Delete a provider document
 *     description: "🔒 Requires **PROVIDER** role. Login as `rajesh.kumar@gmail.com` / `Password@123`"
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: docId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/documents/:docId', authenticate, authorize(ROLES.PROVIDER), docIdParam, validate, async (req, res) => {
  await docService.deleteDocument(req.user.id, req.params.docId);
  res.json(new ApiResponse(StatusCodes.OK, null, 'Document deleted successfully'));
});

// ─────────────────────────────────────────────────────────────────────────────
// Provider Availability
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /providers/availability:
 *   get:
 *     summary: Get the authenticated provider's weekly availability
 *     description: "🔒 Requires **PROVIDER** role. Login as `rajesh.kumar@gmail.com` / `Password@123`"
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Availability returned successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/availability', authenticate, authorize(ROLES.PROVIDER), availabilityController.getAvailability);

/**
 * @swagger
 * /providers/availability:
 *   put:
 *     summary: Replace the provider's weekly availability schedule
 *     description: "🔒 Requires **PROVIDER** role. Login as `rajesh.kumar@gmail.com` / `Password@123`"
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required: [dayOfWeek, startTime, endTime]
 *               properties:
 *                 dayOfWeek:
 *                   type: string
 *                   enum: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY]
 *                   example: MONDAY
 *                 startTime:
 *                   type: string
 *                   example: "09:00"
 *                 endTime:
 *                   type: string
 *                   example: "18:00"
 *                 isAvailable:
 *                   type: boolean
 *                   example: true
 *           example:
 *             - dayOfWeek: MONDAY
 *               startTime: "09:00"
 *               endTime: "18:00"
 *               isAvailable: true
 *             - dayOfWeek: TUESDAY
 *               startTime: "09:00"
 *               endTime: "18:00"
 *               isAvailable: true
 *     responses:
 *       200:
 *         description: Availability updated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/availability', authenticate, authorize(ROLES.PROVIDER), updateAvailabilityValidation, validate, availabilityController.updateAvailability);

// ─────────────────────────────────────────────────────────────────────────────
// Provider Time Off
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /providers/time-off:
 *   get:
 *     summary: Get all time-off entries for the authenticated provider
 *     description: "🔒 Requires **PROVIDER** role. Login as `rajesh.kumar@gmail.com` / `Password@123`"
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Time-off list returned successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/time-off', authenticate, authorize(ROLES.PROVIDER), availabilityController.getTimeOffs);

/**
 * @swagger
 * /providers/time-off:
 *   post:
 *     summary: Create a time-off block for the provider
 *     description: "🔒 Requires **PROVIDER** role. Login as `rajesh.kumar@gmail.com` / `Password@123`"
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [startDate, endDate]
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-24"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-26"
 *               reason:
 *                 type: string
 *                 example: "Christmas holiday"
 *     responses:
 *       201:
 *         description: Time-off created successfully
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
 *     summary: Delete a time-off entry
 *     description: "🔒 Requires **PROVIDER** role. Login as `rajesh.kumar@gmail.com` / `Password@123`"
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: timeOffId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Time-off deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/time-off/:timeOffId', authenticate, authorize(ROLES.PROVIDER), timeOffIdParam, validate, availabilityController.deleteTimeOff);

// ─────────────────────────────────────────────────────────────────────────────
// Provider Services
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /providers/services:
 *   get:
 *     summary: Get all services offered by the authenticated provider
 *     description: "🔒 Requires **PROVIDER** role. Login as `rajesh.kumar@gmail.com` / `Password@123`"
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Provider services returned successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/services', authenticate, authorize(ROLES.PROVIDER), psController.getProviderServices);

/**
 * @swagger
 * /providers/services:
 *   post:
 *     summary: Add a catalog service to the provider's offered services
 *     description: "🔒 Requires **PROVIDER** role. Login as `rajesh.kumar@gmail.com` / `Password@123`"
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [serviceId]
 *             properties:
 *               serviceId:
 *                 type: integer
 *                 example: 1
 *               customPrice:
 *                 type: number
 *                 example: 499.00
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *               description:
 *                 type: string
 *                 example: "Professional pipe fitting and leak repair"
 *     responses:
 *       201:
 *         description: Provider service created successfully
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
 *     summary: Update a provider's offered service
 *     description: "🔒 Requires **PROVIDER** role. Login as `rajesh.kumar@gmail.com` / `Password@123`"
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: providerServiceId
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
 *             properties:
 *               customPrice:
 *                 type: number
 *                 example: 599.00
 *               isAvailable:
 *                 type: boolean
 *                 example: false
 *               description:
 *                 type: string
 *                 example: "Updated service description"
 *     responses:
 *       200:
 *         description: Provider service updated successfully
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
 *     summary: Remove a service from the provider's offerings
 *     description: "🔒 Requires **PROVIDER** role. Login as `rajesh.kumar@gmail.com` / `Password@123`"
 *     tags: [Providers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: providerServiceId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Provider service removed successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/services/:providerServiceId', authenticate, authorize(ROLES.PROVIDER), pSvcIdParam, validate, psController.deleteProviderService);

module.exports = router;
