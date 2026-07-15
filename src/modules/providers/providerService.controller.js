'use strict';

const psService = require('./providerService.service');
const ApiResponse = require('../../utils/ApiResponse');
const { StatusCodes } = require('http-status-codes');

const getProviderServices = async (req, res) => {
  const data = await psService.getProviderServices(req.user.id);
  res.json(new ApiResponse(StatusCodes.OK, data, 'Provider services fetched successfully'));
};

const createProviderService = async (req, res) => {
  const data = await psService.createProviderService(req.user.id, req.body);
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, data, 'Provider service added successfully'));
};

const updateProviderService = async (req, res) => {
  const data = await psService.updateProviderService(req.user.id, req.params.providerServiceId, req.body);
  res.json(new ApiResponse(StatusCodes.OK, data, 'Provider service updated successfully'));
};

const deleteProviderService = async (req, res) => {
  await psService.deleteProviderService(req.user.id, req.params.providerServiceId);
  res.json(new ApiResponse(StatusCodes.OK, null, 'Provider service deleted successfully'));
};

module.exports = {
  getProviderServices,
  createProviderService,
  updateProviderService,
  deleteProviderService,
};
