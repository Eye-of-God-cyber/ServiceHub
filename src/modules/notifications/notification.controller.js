'use strict';

const notificationService = require('./notification.service');
const ApiResponse = require('../../utils/ApiResponse');
const { StatusCodes } = require('http-status-codes');

const getNotifications = async (req, res) => {
  const data = await notificationService.getNotifications(req.user.id, req.query);
  res.json(new ApiResponse(StatusCodes.OK, data, 'Notifications fetched successfully'));
};

const markAsRead = async (req, res) => {
  const data = await notificationService.markAsRead(req.user.id, req.params.notificationId);
  res.json(new ApiResponse(StatusCodes.OK, data, 'Notification marked as read'));
};

const markAllAsRead = async (req, res) => {
  const data = await notificationService.markAllAsRead(req.user.id);
  res.json(new ApiResponse(StatusCodes.OK, data, 'All notifications marked as read'));
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
