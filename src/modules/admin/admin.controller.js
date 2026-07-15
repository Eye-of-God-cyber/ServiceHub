'use strict';

const adminService = require('./admin.service');
const ApiResponse = require('../../utils/ApiResponse');
const { StatusCodes } = require('http-status-codes');

const updateDocumentStatus = async (req, res) => {
  const { status, adminNotes } = req.body;
  const data = await adminService.updateDocumentStatus(req.params.docId, status, adminNotes);
  res.json(new ApiResponse(StatusCodes.OK, data, 'Document status updated successfully'));
};

const resolveDispute = async (req, res) => {
  const data = await adminService.resolveDispute(req.params.disputeId, req.body.resolution);
  res.json(new ApiResponse(StatusCodes.OK, data, 'Dispute resolved successfully'));
};

module.exports = {
  updateDocumentStatus,
  resolveDispute,
};
