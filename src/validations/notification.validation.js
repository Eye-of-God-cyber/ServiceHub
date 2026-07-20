'use strict';

const { param, query } = require('express-validator');

const notificationIdParam = [
  param('notificationId')
    .isInt({ min: 1 }).withMessage('notificationId must be a positive integer')
    .toInt(),
];

const listNotificationsValidation = [
  query('unreadOnly')
    .optional()
    .isBoolean().withMessage('unreadOnly must be a boolean')
    .toBoolean(),
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100')
    .toInt(),
];

module.exports = {
  notificationIdParam,
  listNotificationsValidation,
};
