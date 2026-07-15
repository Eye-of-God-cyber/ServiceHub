'use strict';

const { body, param } = require('express-validator');

const DOCUMENT_TYPES = ['ID_PROOF', 'ADDRESS_PROOF', 'CERTIFICATION', 'POLICE_CLEARANCE', 'BUSINESS_LICENSE'];

const docIdParam = [
  param('docId').isInt({ min: 1 }).withMessage('Document ID must be a positive integer').toInt(),
];

const createDocumentValidation = [
  body('documentType')
    .trim().notEmpty().withMessage('Document type is required')
    .isIn(DOCUMENT_TYPES)
    .withMessage(`Document type must be one of: ${DOCUMENT_TYPES.join(', ')}`),
  body('documentUrl')
    .trim().notEmpty().withMessage('Document URL is required')
    .isURL({ require_protocol: true, protocols: ['http', 'https'] })
    .withMessage('Document URL must be a valid http/https URL')
    .isLength({ max: 512 }).withMessage('Document URL cannot exceed 512 characters'),
  // Block client-supplied status — only admin can change it
  body('status').not().exists().withMessage('Status is managed by admins'),
  body('adminNotes').not().exists().withMessage('adminNotes is a protected field'),
];

module.exports = { docIdParam, createDocumentValidation };
