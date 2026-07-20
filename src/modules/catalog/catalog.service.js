'use strict';

const prisma = require('../../config/prisma');
const AppError = require('../../utils/AppError');
const { StatusCodes } = require('http-status-codes');
const { getPaginationOptions, formatPaginatedResponse } = require('../../utils/pagination.util');

const getCategories = async () => {
  return prisma.serviceCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
};

const getServices = async (categoryId, filters = {}) => {
  const where = { isActive: true };
  if (categoryId) {
    where.categoryId = categoryId;
  }

  const { page, limit, skip, take } = getPaginationOptions(filters);

  const [data, total] = await Promise.all([
    prisma.service.findMany({
      where,
      include: {
        category: { select: { name: true } }
      },
      orderBy: { id: 'desc' },
      skip,
      take,
    }),
    prisma.service.count({ where }),
  ]);

  return formatPaginatedResponse(data, total, page, limit);
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
