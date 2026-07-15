'use strict';

const authService = require('./auth.service');
const ApiResponse = require('../../utils/ApiResponse');
const { StatusCodes } = require('http-status-codes');

/**
 * @desc    Register a new user (CUSTOMER or PROVIDER)
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  const { firstName, lastName, email, phone, password, role } = req.body;

  // Delegate entirely to the service layer.
  // The controller remains thin, handling only HTTP transport mapping.
  const registeredUser = await authService.registerUser({
    firstName,
    lastName,
    email,
    phone,
    password,
    role,
  });

  return res.status(StatusCodes.CREATED).json(
    new ApiResponse(
      StatusCodes.CREATED,
      registeredUser,
      'Registration successful. Please login to continue.'
    )
  );
};

/**
 * @desc    Login a user and return JWT
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // Delegate purely to service layer
  const { accessToken, user } = await authService.loginUser({ email, password });

  return res.status(StatusCodes.OK).json(
    new ApiResponse(
      StatusCodes.OK,
      { accessToken, user },
      'Login successful'
    )
  );
};

module.exports = {
  register,
  login,
  getMe: async (req, res) => {
    // req.user.id was attached by authenticate middleware.
    // We pass only the ID to the service — never the full req.user —
    // to force a clean re-fetch and avoid stale-cache issues.
    const profile = await authService.getMe(req.user.id);

    return res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, profile, 'Profile fetched successfully')
    );
  },
};
