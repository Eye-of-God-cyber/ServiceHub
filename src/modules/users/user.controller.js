'use strict';

const userService = require('./user.service');
const ApiResponse = require('../../utils/ApiResponse');
const { StatusCodes } = require('http-status-codes');

/**
 * @desc    Get authenticated user's full profile
 * @route   GET /api/v1/users/profile
 * @access  ADMIN | PROVIDER | CUSTOMER
 */
const getProfile = async (req, res) => {
  // ID sourced exclusively from authenticate middleware — never from params/body
  const profile = await userService.getProfile(req.user.id);

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, profile, 'Profile fetched successfully')
  );
};

/**
 * @desc    Update authenticated user's profile
 * @route   PUT /api/v1/users/profile
 * @access  ADMIN | PROVIDER | CUSTOMER
 */
const updateProfile = async (req, res) => {
  const { firstName, lastName, dateOfBirth, avatarUrl, phone } = req.body;

  const updated = await userService.updateProfile(req.user.id, {
    firstName,
    lastName,
    dateOfBirth,
    avatarUrl,
    phone,
  });

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, updated, 'Profile updated successfully')
  );
};

module.exports = {
  getProfile,
  updateProfile,
};
