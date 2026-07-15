'use strict';

const { PrismaClient } = require('@prisma/client');
const AppError = require('../../utils/AppError');
const { StatusCodes } = require('http-status-codes');

const prisma = new PrismaClient();

const getProviderId = async (userId) => {
  const pp = await prisma.providerProfile.findUnique({ where: { userId }, select: { id: true } });
  if (!pp) {throw new AppError('Provider profile not found.', StatusCodes.NOT_FOUND);}
  return pp.id;
};

const assertOwnership = async (providerServiceId, providerId) => {
  const ps = await prisma.providerService.findUnique({ where: { id: providerServiceId }, select: { id: true, providerId: true } });
  if (!ps) {throw new AppError('Provider service not found.', StatusCodes.NOT_FOUND);}
  if (ps.providerId !== providerId) {throw new AppError('You do not have permission to access this service.', StatusCodes.FORBIDDEN);}
  return ps;
};

const getProviderServices = async (userId) => {
  const providerId = await getProviderId(userId);
  return prisma.providerService.findMany({
    where: { providerId },
    include: {
      service: {
        select: { name: true, basePrice: true, unit: true, categoryId: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const createProviderService = async (userId, payload) => {
  const providerId = await getProviderId(userId);
  const { serviceId, customPrice, isAvailable, description } = payload;
  
  // Verify base service exists
  const baseSvc = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!baseSvc) {throw new AppError('Base service not found.', StatusCodes.NOT_FOUND);}

  // Check for duplicate
  const existing = await prisma.providerService.findFirst({
    where: { providerId, serviceId }
  });
  if (existing) {
    throw new AppError('You have already added this service to your profile.', StatusCodes.CONFLICT);
  }

  return prisma.providerService.create({
    data: {
      providerId,
      serviceId,
      customPrice: customPrice !== undefined ? customPrice : null,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      description: description || null,
    },
    include: { service: { select: { name: true, basePrice: true, unit: true } } },
  });
};

const updateProviderService = async (userId, providerServiceId, payload) => {
  const providerId = await getProviderId(userId);
  await assertOwnership(providerServiceId, providerId);
  
  const { customPrice, isAvailable, description } = payload;
  
  const data = {};
  if (customPrice !== undefined) {data.customPrice = customPrice;}
  if (isAvailable !== undefined) {data.isAvailable = isAvailable;}
  if (description !== undefined) {data.description = description;}

  return prisma.providerService.update({
    where: { id: providerServiceId },
    data,
    include: { service: { select: { name: true, basePrice: true, unit: true } } },
  });
};

const deleteProviderService = async (userId, providerServiceId) => {
  const providerId = await getProviderId(userId);
  await assertOwnership(providerServiceId, providerId);

  // We should restrict deletion if there are bookings referencing this providerServiceId
  const bookings = await prisma.booking.count({ where: { providerServiceId } });
  if (bookings > 0) {
    throw new AppError('Cannot delete a service that has existing bookings. Please mark it as unavailable instead.', StatusCodes.UNPROCESSABLE_ENTITY);
  }

  await prisma.providerService.delete({ where: { id: providerServiceId } });
};

module.exports = {
  getProviderServices,
  createProviderService,
  updateProviderService,
  deleteProviderService,
};
