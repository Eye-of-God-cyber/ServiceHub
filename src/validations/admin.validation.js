'use strict';

const { body, param } = require('express-validator');


const docIdParam = [
  param('docId').isInt({ min: 1 }).withMessage('docId must be a positive integer').toInt(),
];

const disputeIdParam = [
  param('disputeId').isInt({ min: 1 }).withMessage('disputeId must be a positive integer').toInt(),
];

const updateDocStatusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['APPROVED', 'REJECTED']).withMessage('Status must be APPROVED or REJECTED'),
  body('adminNotes')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
];

const resolveDisputeValidation = [
  body('resolution')
    .notEmpty().withMessage('Resolution note is required')
    .trim()
    .isLength({ max: 1000 }).withMessage('Resolution cannot exceed 1000 characters'),
];

module.exports = {
  docIdParam,
  disputeIdParam,
  updateDocStatusValidation,
  resolveDisputeValidation,
};
