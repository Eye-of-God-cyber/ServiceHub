'use strict';

const express = require('express');
const router  = express.Router();

const catalogController = require('./catalog.controller');
const validate          = require('../../middleware/validate');
const { getServicesValidation, serviceIdParam } = require('../../validations/catalog.validation');

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /catalog/categories:
 *   get:
 *     summary: GET /catalog/categories
 *     tags: [catalog]
 *     
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
// GET /api/v1/catalog/categories
// ─────────────────────────────────────────────────────────────────────────────
router.get('/categories', catalogController.getCategories);

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /catalog/services:
 *   get:
 *     summary: GET /catalog/services
 *     tags: [catalog]
 *     
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
// GET /api/v1/catalog/services
// ─────────────────────────────────────────────────────────────────────────────
router.get('/services', getServicesValidation, validate, catalogController.getServices);

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /catalog/services/{serviceId}:
 *   get:
 *     summary: GET /catalog/services/{serviceId}
 *     tags: [catalog]
 *     
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
// GET /api/v1/catalog/services/:serviceId
// ─────────────────────────────────────────────────────────────────────────────
router.get('/services/:serviceId', serviceIdParam, validate, catalogController.getServiceById);

module.exports = router;
