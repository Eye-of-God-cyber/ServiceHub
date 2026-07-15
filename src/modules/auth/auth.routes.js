'use strict';

const express = require('express');
const router = express.Router();

const authController = require('./auth.controller');
const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/auth.middleware');
const { registerValidation, loginValidation } = require('../../validations/auth.validation');

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: POST /auth/register
 *     tags: [auth]
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
// POST /api/v1/auth/register
// ─────────────────────────────────────────────────────────────────────────────
router.post('/register', registerValidation, validate, authController.register);

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: POST /auth/login
 *     tags: [auth]
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
// POST /api/v1/auth/login
// ─────────────────────────────────────────────────────────────────────────────
router.post('/login', loginValidation, validate, authController.login);

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: GET /auth/me
 *     tags: [auth]
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
// GET  /api/v1/auth/me  (protected)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/me', authenticate, authController.getMe);

module.exports = router;
