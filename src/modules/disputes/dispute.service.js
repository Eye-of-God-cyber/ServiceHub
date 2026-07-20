'use strict';

const prisma = require('../../config/prisma');
const AppError = require('../../utils/AppError');
const { StatusCodes } = require('http-status-codes');
const { getPaginationOptions, formatPaginatedResponse } = require('../../utils/pagination.util');
const { getProviderIdOrNull } = require('../../utils/provider.util');


// Common include for disputes
const DISPUTE_INCLUDE = {
  raisedBy: { select: { id: true, email: true, userProfile: { select: { firstName: true, lastName: true } } } },
  booking: { select: { id: true, status: true, service: { select: { name: true } } } },
  messages: {
    include: {
      sender: { select: { id: true, userProfile: { select: { firstName: true, lastName: true } } } }
    },
    orderBy: { createdAt: 'asc' },
  },
};

const assertDisputeAccess = async (userId, userRoles, disputeId) => {
  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    include: { booking: { select: { customerId: true, providerId: true } } },
  });

  if (!dispute) {throw new AppError('Dispute not found', StatusCodes.NOT_FOUND);}

  if (userRoles.includes('ADMIN')) {return dispute;}

  let isOwner = false;
  if (userRoles.includes('CUSTOMER') && dispute.booking.customerId === userId) {
    isOwner = true;
  }
  if (!isOwner && userRoles.includes('PROVIDER')) {
    const providerId = await getProviderIdOrNull(userId);
    if (providerId && dispute.booking.providerId === providerId) {
      isOwner = true;
    }
  }

  if (!isOwner) {throw new AppError('You do not have permission to access this dispute', StatusCodes.FORBIDDEN);}

  return dispute;
};

const getDisputeById = async (userId, userRoles, disputeId) => {
  await assertDisputeAccess(userId, userRoles, disputeId);

  return prisma.dispute.findUnique({
    where: { id: disputeId },
    include: DISPUTE_INCLUDE,
  });
};

const getDisputes = async (userId, userRoles, filters = {}) => {
  const where = {};
  const orConditions = [];

  if (userRoles.includes('CUSTOMER')) {
    orConditions.push({ booking: { customerId: userId } });
  }

  if (userRoles.includes('PROVIDER')) {
    const providerId = await getProviderIdOrNull(userId);
    if (providerId) {
      orConditions.push({ booking: { providerId } });
    }
  }

  if (orConditions.length === 0 && !userRoles.includes('ADMIN')) {return formatPaginatedResponse([], 0, 1, 20);}
  if (orConditions.length > 0) {where.OR = orConditions;}

  const { page, limit, skip, take } = getPaginationOptions(filters);

  const [data, total] = await Promise.all([
    prisma.dispute.findMany({
      where,
      include: {
        booking: { select: { id: true, service: { select: { name: true } } } },
        raisedBy: { select: { userProfile: { select: { firstName: true, lastName: true } } } }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.dispute.count({ where }),
  ]);

  return formatPaginatedResponse(data, total, page, limit);
};

const createDispute = async (userId, userRoles, payload) => {
  const { bookingId, subject, description } = payload;
  
  // Verify booking ownership (both Customer or Provider can raise a dispute)
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {throw new AppError('Booking not found', StatusCodes.NOT_FOUND);}
  
  let isParticipant = false;
  if (userRoles.includes('CUSTOMER') && booking.customerId === userId) {isParticipant = true;}
  if (!isParticipant && userRoles.includes('PROVIDER')) {
    const providerId = await getProviderIdOrNull(userId);
    if (providerId && booking.providerId === providerId) {isParticipant = true;}
  }

  if (!isParticipant) {throw new AppError('You are not a participant in this booking', StatusCodes.FORBIDDEN);}

  return prisma.dispute.create({
    data: {
      bookingId,
      raisedById: userId,
      subject,
      description,
    },
    include: DISPUTE_INCLUDE,
  });
};

const addDisputeMessage = async (userId, userRoles, disputeId, payload) => {
  const dispute = await assertDisputeAccess(userId, userRoles, disputeId);

  if (dispute.status === 'RESOLVED') {
    throw new AppError('Cannot add messages to a resolved dispute', StatusCodes.UNPROCESSABLE_ENTITY);
  }

  return prisma.disputeMessage.create({
    data: {
      disputeId,
      senderId: userId,
      message: payload.message,
    },
    include: {
      sender: { select: { userProfile: { select: { firstName: true, lastName: true } } } }
    },
  });
};

module.exports = {
  getDisputeById,
  getDisputes,
  createDispute,
  addDisputeMessage,
};
