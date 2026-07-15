'use strict';

const { PrismaClient } = require('@prisma/client');
const AppError = require('../../utils/AppError');
const { StatusCodes } = require('http-status-codes');

const prisma = new PrismaClient();

const getNotifications = async (userId, filters = {}) => {
  const where = { userId };
  if (filters.unreadOnly) {
    where.isRead = false;
  }

  return prisma.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 50, // Limit to 50 most recent for performance
  });
};

const markAsRead = async (userId, notificationId) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
    select: { id: true, userId: true },
  });

  if (!notification) {
    throw new AppError('Notification not found', StatusCodes.NOT_FOUND);
  }
  if (notification.userId !== userId) {
    throw new AppError('You do not have permission to modify this notification', StatusCodes.FORBIDDEN);
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};

const markAllAsRead = async (userId) => {
  const result = await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
  return { count: result.count };
};

/**
 * Internal method to create a notification (called by other services)
 */
const createNotification = async (userId, type, title, body, data = null) => {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      body,
      data,
    },
  });
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
};
