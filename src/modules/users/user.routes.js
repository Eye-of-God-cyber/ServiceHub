'use strict';

const express = require('express');
const router = express.Router();

const userController    = require('./user.controller');
const addressController = require('./address.controller');
const authenticate      = require('../../middleware/auth.middleware');
const authorize         = require('../../middleware/role.middleware');
const validate          = require('../../middleware/validate');
const { updateProfileValidation }   = require('../../validations/user.validation');
const {
  addressIdParam,
  createAddressValidation,
  updateAddressValidation,
} = require('../../validations/address.validation');
const { ROLES } = require('../../config/roles');

// All three roles may manage their own profile and addresses
const allRoles = [ROLES.ADMIN, ROLES.PROVIDER, ROLES.CUSTOMER];

// ─────────────────────────────────────────────────────────────────────────────
// Profile Routes
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: GET /users/profile
 *     tags: [Users]
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
router.get('/profile', authenticate, authorize(...allRoles), userController.getProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: PUT /users/profile
 *     tags: [Users]
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
router.put('/profile', authenticate, authorize(...allRoles), updateProfileValidation, validate, userController.updateProfile);

// ─────────────────────────────────────────────────────────────────────────────
// Address Routes
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /users/addresses:
 *   get:
 *     summary: GET /users/addresses
 *     tags: [users]
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
// GET    /api/v1/users/addresses
router.get('/addresses', authenticate, authorize(...allRoles), addressController.getAddresses);

/**
 * @swagger
 * /users/addresses:
 *   post:
 *     summary: POST /users/addresses
 *     tags: [users]
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
// POST   /api/v1/users/addresses
router.post('/addresses', authenticate, authorize(...allRoles), createAddressValidation, validate, addressController.createAddress);

/**
 * @swagger
 * /users/addresses/{addressId}:
 *   put:
 *     summary: PUT /users/addresses/{addressId}
 *     tags: [users]
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
// PUT    /api/v1/users/addresses/:addressId
router.put('/addresses/:addressId', authenticate, authorize(...allRoles), addressIdParam, updateAddressValidation, validate, addressController.updateAddress);

/**
 * @swagger
 * /users/addresses/{addressId}:
 *   delete:
 *     summary: DELETE /users/addresses/{addressId}
 *     tags: [users]
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
// DELETE /api/v1/users/addresses/:addressId
router.delete('/addresses/:addressId', authenticate, authorize(...allRoles), addressIdParam, validate, addressController.deleteAddress);

/**
 * @swagger
 * /users/addresses/{addressId}/default:
 *   patch:
 *     summary: PATCH /users/addresses/{addressId}/default
 *     tags: [users]
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
// PATCH  /api/v1/users/addresses/:addressId/default
router.patch('/addresses/:addressId/default', authenticate, authorize(...allRoles), addressIdParam, validate, addressController.setDefaultAddress);

module.exports = router;
