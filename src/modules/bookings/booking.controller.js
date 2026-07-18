'use strict';

const bookingService = require('./booking.service');
const ApiResponse = require('../../utils/ApiResponse');
const { StatusCodes } = require('http-status-codes');

const createBooking = async (req, res) => {
  const data = await bookingService.createBooking(req.user.id, req.body);
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, data, 'Booking created successfully'));
};

const getBookings = async (req, res) => {
  const roleNames = req.user.userRoles.map(ur => ur.role.name);
  const result = await bookingService.getBookings(req.user.id, roleNames, req.query);
  const response = new ApiResponse(StatusCodes.OK, result.data, 'Bookings fetched successfully');
  response.meta = result.meta;
  res.json(response);
};

const getBookingById = async (req, res) => {
  const roleNames = req.user.userRoles.map(ur => ur.role.name);
  const data = await bookingService.getBookingById(req.user.id, roleNames, req.params.bookingId);
  res.json(new ApiResponse(StatusCodes.OK, data, 'Booking details fetched successfully'));
};

const updateBookingStatus = async (req, res) => {
  const roleNames = req.user.userRoles.map(ur => ur.role.name);
  const data = await bookingService.updateBookingStatus(req.user.id, roleNames, req.params.bookingId, req.body);
  res.json(new ApiResponse(StatusCodes.OK, data, 'Booking status updated successfully'));
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
};
