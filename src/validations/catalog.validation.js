'use strict';

const { query, param } = require('express-validator');

const getServicesValidation = [
  query('categoryId')
    .optional()
    .isInt({ min: 1 }).withMessage('categoryId must be a positive integer')
    .toInt(),
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100')
    .toInt(),
];

const serviceIdParam = [
  param('serviceId')
    .isInt({ min: 1 }).withMessage('serviceId must be a positive integer')
    .toInt(),
];

module.exports = {
  getServicesValidation,
  serviceIdParam,
};
