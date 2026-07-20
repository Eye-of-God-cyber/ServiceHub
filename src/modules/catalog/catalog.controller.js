'use strict';

const catalogService = require('./catalog.service');
const ApiResponse = require('../../utils/ApiResponse');
const { StatusCodes } = require('http-status-codes');

const getCategories = async (req, res) => {
  const data = await catalogService.getCategories();
  res.json(new ApiResponse(StatusCodes.OK, data, 'Categories fetched successfully'));
};

const getServices = async (req, res) => {
  const { categoryId, ...filters } = req.query;
  const result = await catalogService.getServices(categoryId, filters);
  return ApiResponse.success(res, { message: 'Services fetched successfully', data: result.data, meta: result.meta });
};

const getServiceById = async (req, res) => {
  const data = await catalogService.getServiceById(req.params.serviceId);
  res.json(new ApiResponse(StatusCodes.OK, data, 'Service details fetched successfully'));
};

module.exports = {
  getCategories,
  getServices,
  getServiceById,
};
