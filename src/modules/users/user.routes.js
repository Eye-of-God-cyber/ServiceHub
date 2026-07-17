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
 *     summary: Get the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/profile', authenticate, authorize(...allRoles), userController.getProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Arjun
 *               lastName:
 *                 type: string
 *                 example: Mehta
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1995-06-15"
 *               avatarUrl:
 *                 type: string
 *                 example: "https://example.com/avatar.png"
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *     summary: Get all addresses for the authenticated user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses returned successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
// GET    /api/v1/users/addresses
router.get('/addresses', authenticate, authorize(...allRoles), addressController.getAddresses);

/**
 * @swagger
 * /users/addresses:
 *   post:
 *     summary: Create a new address for the authenticated user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [line1, city, state, pincode]
 *             properties:
 *               label:
 *                 type: string
 *                 enum: [Home, Work, Other]
 *                 example: Home
 *               line1:
 *                 type: string
 *                 example: "12 MG Road"
 *               line2:
 *                 type: string
 *                 example: "Apartment 4B"
 *               city:
 *                 type: string
 *                 example: Mumbai
 *               state:
 *                 type: string
 *                 example: Maharashtra
 *               pincode:
 *                 type: string
 *                 example: "400001"
 *               latitude:
 *                 type: number
 *                 example: 19.076
 *               longitude:
 *                 type: number
 *                 example: 72.8777
 *     responses:
 *       201:
 *         description: Address created successfully
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
 *     summary: Update an existing address
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
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
 *               label:
 *                 type: string
 *                 enum: [Home, Work, Other]
 *                 example: Work
 *               line1:
 *                 type: string
 *                 example: "45 Bandra West"
 *               line2:
 *                 type: string
 *                 example: ""
 *               city:
 *                 type: string
 *                 example: Mumbai
 *               state:
 *                 type: string
 *                 example: Maharashtra
 *               pincode:
 *                 type: string
 *                 example: "400050"
 *     responses:
 *       200:
 *         description: Address updated successfully
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
 *     summary: Delete an address
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
// DELETE /api/v1/users/addresses/:addressId
router.delete('/addresses/:addressId', authenticate, authorize(...allRoles), addressIdParam, validate, addressController.deleteAddress);

/**
 * @swagger
 * /users/addresses/{addressId}/default:
 *   patch:
 *     summary: Set an address as the default
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Default address updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
// PATCH  /api/v1/users/addresses/:addressId/default
router.patch('/addresses/:addressId/default', authenticate, authorize(...allRoles), addressIdParam, validate, addressController.setDefaultAddress);

module.exports = router;
