'use strict';

const { body, param } = require('express-validator');

const pSvcIdParam = [
  param('providerServiceId').isInt({ min: 1 }).withMessage('ID must be a positive integer').toInt(),
];

const createProviderServiceValidation = [
  body('serviceId')
    .notEmpty().withMessage('Service ID is required')
    .isInt({ min: 1 }).withMessage('Service ID must be a positive integer').toInt(),
  body('customPrice')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('Custom price must be a positive number')
    .toFloat(),
  body('isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable must be a boolean')
    .toBoolean(),
  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
];

const updateProviderServiceValidation = [
  body('customPrice')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('Custom price must be a positive number')
    .toFloat(),
  body('isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable must be a boolean')
    .toBoolean(),
  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('serviceId').not().exists().withMessage('Cannot change the base service ID once created'),
];

module.exports = {
  pSvcIdParam,
  createProviderServiceValidation,
  updateProviderServiceValidation,
};
