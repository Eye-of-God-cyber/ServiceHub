'use strict';

const addressService = require('./address.service');
const ApiResponse = require('../../utils/ApiResponse');
const { StatusCodes } = require('http-status-codes');

/**
 * @desc   Get all addresses for the authenticated user
 * @route  GET /api/v1/users/addresses
 */
const getAddresses = async (req, res) => {
  const addresses = await addressService.getAddresses(req.user.id);
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, addresses, 'Addresses fetched successfully')
  );
};

/**
 * @desc   Create a new address
 * @route  POST /api/v1/users/addresses
 */
const createAddress = async (req, res) => {
  const { label, line1, line2, city, state, pincode, latitude, longitude } = req.body;
  const address = await addressService.createAddress(req.user.id, {
    label, line1, line2, city, state, pincode, latitude, longitude,
  });
  return res.status(StatusCodes.CREATED).json(
    new ApiResponse(StatusCodes.CREATED, address, 'Address created successfully')
  );
};

/**
 * @desc   Update an address
 * @route  PUT /api/v1/users/addresses/:addressId
 */
const updateAddress = async (req, res) => {
  const { label, line1, line2, city, state, pincode, latitude, longitude } = req.body;
  const address = await addressService.updateAddress(
    req.params.addressId,
    req.user.id,
    { label, line1, line2, city, state, pincode, latitude, longitude }
  );
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, address, 'Address updated successfully')
  );
};

/**
 * @desc   Delete an address
 * @route  DELETE /api/v1/users/addresses/:addressId
 */
const deleteAddress = async (req, res) => {
  await addressService.deleteAddress(req.params.addressId, req.user.id);
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, null, 'Address deleted successfully')
  );
};

/**
 * @desc   Set an address as default
 * @route  PATCH /api/v1/users/addresses/:addressId/default
 */
const setDefaultAddress = async (req, res) => {
  const address = await addressService.setDefaultAddress(req.params.addressId, req.user.id);
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, address, 'Default address updated successfully')
  );
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
