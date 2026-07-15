'use strict';

const availabilityService = require('./availability.service');
const ApiResponse = require('../../utils/ApiResponse');
const { StatusCodes } = require('http-status-codes');

// ─────────────────────────────────────────────────────────────────────────────
// Availability
// ─────────────────────────────────────────────────────────────────────────────

const getAvailability = async (req, res) => {
  const data = await availabilityService.getAvailability(req.user.id);
  res.json(new ApiResponse(StatusCodes.OK, data, 'Availability fetched successfully'));
};

const updateAvailability = async (req, res) => {
  const data = await availabilityService.updateAvailability(req.user.id, req.body);
  res.json(new ApiResponse(StatusCodes.OK, data, 'Availability updated successfully'));
};

// ─────────────────────────────────────────────────────────────────────────────
// Time Off
// ─────────────────────────────────────────────────────────────────────────────

const getTimeOffs = async (req, res) => {
  const data = await availabilityService.getTimeOffs(req.user.id);
  res.json(new ApiResponse(StatusCodes.OK, data, 'Time-off records fetched successfully'));
};

const createTimeOff = async (req, res) => {
  const data = await availabilityService.createTimeOff(req.user.id, req.body);
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, data, 'Time-off record created successfully'));
};

const deleteTimeOff = async (req, res) => {
  await availabilityService.deleteTimeOff(req.user.id, req.params.timeOffId);
  res.json(new ApiResponse(StatusCodes.OK, null, 'Time-off record deleted successfully'));
};

module.exports = {
  getAvailability,
  updateAvailability,
  getTimeOffs,
  createTimeOff,
  deleteTimeOff,
};
