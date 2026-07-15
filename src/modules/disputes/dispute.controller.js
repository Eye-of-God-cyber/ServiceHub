'use strict';

const disputeService = require('./dispute.service');
const ApiResponse = require('../../utils/ApiResponse');
const { StatusCodes } = require('http-status-codes');

const getDisputes = async (req, res) => {
  const result = await disputeService.getDisputes(req.user.id, req.user.userRoles, req.query);
  const response = new ApiResponse(StatusCodes.OK, result.data, 'Disputes fetched successfully');
  response.meta = result.meta;
  res.json(response);
};

const getDisputeById = async (req, res) => {
  const data = await disputeService.getDisputeById(req.user.id, req.user.userRoles, req.params.disputeId);
  res.json(new ApiResponse(StatusCodes.OK, data, 'Dispute details fetched successfully'));
};

const createDispute = async (req, res) => {
  const data = await disputeService.createDispute(req.user.id, req.user.userRoles, req.body);
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, data, 'Dispute created successfully'));
};

const addDisputeMessage = async (req, res) => {
  const data = await disputeService.addDisputeMessage(req.user.id, req.user.userRoles, req.params.disputeId, req.body);
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, data, 'Message added to dispute'));
};

module.exports = {
  getDisputes,
  getDisputeById,
  createDispute,
  addDisputeMessage,
};
