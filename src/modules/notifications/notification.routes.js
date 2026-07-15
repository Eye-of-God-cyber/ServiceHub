'use strict';

const express = require('express');
const router  = express.Router();

const notificationController = require('./notification.controller');
const authenticate           = require('../../middleware/auth.middleware');
const validate               = require('../../middleware/validate');
const { notificationIdParam, listNotificationsValidation } = require('../../validations/notification.validation');

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: GET /notifications
 *     tags: [notifications]
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
// GET /api/v1/notifications
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  '/',
  authenticate,
  listNotificationsValidation,
  validate,
  notificationController.getNotifications
);

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /notifications/read-all:
 *   patch:
 *     summary: PATCH /notifications/read-all
 *     tags: [notifications]
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
// PATCH /api/v1/notifications/read-all
// ─────────────────────────────────────────────────────────────────────────────
router.patch(
  '/read-all',
  authenticate,
  notificationController.markAllAsRead
);

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /notifications/{notificationId}/read:
 *   patch:
 *     summary: PATCH /notifications/{notificationId}/read
 *     tags: [notifications]
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
// PATCH /api/v1/notifications/:notificationId/read
// ─────────────────────────────────────────────────────────────────────────────
router.patch(
  '/:notificationId/read',
  authenticate,
  notificationIdParam,
  validate,
  notificationController.markAsRead
);

module.exports = router;
