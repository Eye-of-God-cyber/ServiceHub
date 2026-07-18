'use strict';

const disputeService = require('./dispute.service');
const ApiResponse = require('../../utils/ApiResponse');
const { StatusCodes } = require('http-status-codes');

const getDisputes = async (req, res) => {
  const roleNames = req.user.userRoles.map(ur => ur.role.name);
  const result = await disputeService.getDisputes(req.user.id, roleNames, req.query);
  const response = new ApiResponse(StatusCodes.OK, result.data, 'Disputes fetched successfully');
  response.meta = result.meta;
  res.json(response);
};

const getDisputeById = async (req, res) => {
  const roleNames = req.user.userRoles.map(ur => ur.role.name);
  const data = await disputeService.getDisputeById(req.user.id, roleNames, req.params.disputeId);
  res.json(new ApiResponse(StatusCodes.OK, data, 'Dispute details fetched successfully'));
};

const createDispute = async (req, res) => {
  const roleNames = req.user.userRoles.map(ur => ur.role.name);
  const data = await disputeService.createDispute(req.user.id, roleNames, req.body);
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, data, 'Dispute created successfully'));
};

const addDisputeMessage = async (req, res) => {
  const roleNames = req.user.userRoles.map(ur => ur.role.name);
  const data = await disputeService.addDisputeMessage(req.user.id, roleNames, req.params.disputeId, req.body);
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, data, 'Message added to dispute'));
};

module.exports = {
  getDisputes,
  getDisputeById,
  createDispute,
  addDisputeMessage,
};
