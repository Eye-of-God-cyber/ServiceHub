'use strict';

const prisma = require('../../config/prisma');
const AppError = require('../../utils/AppError');
const { StatusCodes } = require('http-status-codes');
const { getProviderId } = require('../../utils/provider.util');


// ─────────────────────────────────────────────────────────────────────────────
// Availability
// ─────────────────────────────────────────────────────────────────────────────

const getAvailability = async (userId) => {
  const providerId = await getProviderId(userId);
  return prisma.providerAvailability.findMany({
    where: { providerId },
    select: { id: true, dayOfWeek: true, startTime: true, endTime: true, isAvailable: true },
    orderBy: { dayOfWeek: 'asc' }, // Or rely on enum order, but sorting usually helps
  });
};

const updateAvailability = async (userId, schedules) => {
  const providerId = await getProviderId(userId);

  return prisma.$transaction(async (tx) => {
    // Delete existing schedules to replace them entirely, ensuring no orphaned days
    await tx.providerAvailability.deleteMany({ where: { providerId } });

    if (schedules.length > 0) {
      const data = schedules.map(s => ({
        providerId,
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        isAvailable: s.isAvailable !== undefined ? s.isAvailable : true,
      }));
      await tx.providerAvailability.createMany({ data });
    }

    return tx.providerAvailability.findMany({
      where: { providerId },
      select: { id: true, dayOfWeek: true, startTime: true, endTime: true, isAvailable: true },
    });
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Time Off
// ─────────────────────────────────────────────────────────────────────────────

const getTimeOffs = async (userId) => {
  const providerId = await getProviderId(userId);
  return prisma.providerTimeOff.findMany({
    where: { providerId },
    select: { id: true, startDate: true, endDate: true, reason: true, createdAt: true },
    orderBy: { startDate: 'asc' },
  });
};

const createTimeOff = async (userId, payload) => {
  const providerId = await getProviderId(userId);
  
  // Basic conflict check: Does this new time off overlap with an existing one?
  const { startDate, endDate, reason } = payload;
  
  const conflict = await prisma.providerTimeOff.findFirst({
    where: {
      providerId,
      AND: [
        { startDate: { lte: endDate } },
        { endDate: { gte: startDate } },
      ]
    }
  });

  if (conflict) {
    throw new AppError('Time off overlaps with an existing record.', StatusCodes.CONFLICT);
  }

  return prisma.providerTimeOff.create({
    data: {
      providerId,
      startDate,
      endDate,
      reason: reason || null,
    },
    select: { id: true, startDate: true, endDate: true, reason: true, createdAt: true },
  });
};

const deleteTimeOff = async (userId, timeOffId) => {
  const providerId = await getProviderId(userId);
  const timeOff = await prisma.providerTimeOff.findUnique({
    where: { id: timeOffId },
    select: { id: true, providerId: true },
  });

  if (!timeOff) {
    throw new AppError('Time off record not found.', StatusCodes.NOT_FOUND);
  }
  if (timeOff.providerId !== providerId) {
    throw new AppError('You do not have permission to delete this record.', StatusCodes.FORBIDDEN);
  }

  await prisma.providerTimeOff.delete({ where: { id: timeOffId } });
};

module.exports = {
  getAvailability,
  updateAvailability,
  getTimeOffs,
  createTimeOff,
  deleteTimeOff,
};
