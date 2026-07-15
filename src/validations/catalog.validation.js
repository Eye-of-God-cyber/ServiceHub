'use strict';

const { query, param } = require('express-validator');

const getServicesValidation = [
  query('categoryId')
    .optional()
    .isInt({ min: 1 }).withMessage('categoryId must be a positive integer')
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
