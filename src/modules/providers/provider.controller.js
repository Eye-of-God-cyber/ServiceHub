'use strict';

const providerService = require('./provider.service');
const ApiResponse = require('../../utils/ApiResponse');
const { StatusCodes } = require('http-status-codes');

/**
 * @desc   Get the authenticated provider's profile
 * @route  GET /api/v1/providers/me
 * @access PROVIDER only
 */
const getProviderProfile = async (req, res) => {
  const profile = await providerService.getProviderProfile(req.user.id);
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, profile, 'Provider profile fetched successfully')
  );
};

/**
 * @desc   Update the authenticated provider's profile
 * @route  PUT /api/v1/providers/me
 * @access PROVIDER only
 */
const updateProviderProfile = async (req, res) => {
  const {
    bio, experienceYears, isAvailable,
    firstName, lastName, avatarUrl,
  } = req.body;

  const updated = await providerService.updateProviderProfile(req.user.id, {
    bio, experienceYears, isAvailable,
    firstName, lastName, avatarUrl,
  });

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, updated, 'Provider profile updated successfully')
  );
};

module.exports = {
  getProviderProfile,
  updateProviderProfile,
};
