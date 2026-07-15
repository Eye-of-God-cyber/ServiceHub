'use strict';

const { PrismaClient } = require('@prisma/client');
const AppError = require('../../utils/AppError');
const { StatusCodes } = require('http-status-codes');

const prisma = new PrismaClient();

const getCategories = async () => {
  return prisma.serviceCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
};

const getServices = async (categoryId) => {
  const where = { isActive: true };
  if (categoryId) {
    where.categoryId = categoryId;
  }

  return prisma.service.findMany({
    where,
    include: {
      category: { select: { name: true } }
    },
    orderBy: { name: 'asc' },
  });
};

const getServiceById = async (serviceId) => {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      category: { select: { name: true } },
      // Include providers offering this service, but only if they are available
      providerServices: {
        where: { isAvailable: true },
        include: {
          provider: {
            select: {
              id: true,
              bio: true,
              experienceYears: true,
              verificationStatus: true,
              avgRating: true,
              totalReviews: true,
              user: {
                select: {
                  userProfile: {
                    select: { firstName: true, lastName: true, avatarUrl: true }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!service || !service.isActive) {
    throw new AppError('Service not found or inactive.', StatusCodes.NOT_FOUND);
  }

  return service;
};

module.exports = {
  getCategories,
  getServices,
  getServiceById,
};
