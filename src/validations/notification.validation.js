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
];

module.exports = {
  notificationIdParam,
  listNotificationsValidation,
};
