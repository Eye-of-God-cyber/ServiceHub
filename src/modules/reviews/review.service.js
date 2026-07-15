'use strict';

const { PrismaClient } = require('@prisma/client');
const AppError = require('../../utils/AppError');
const { StatusCodes } = require('http-status-codes');
const { Decimal } = require('@prisma/client/runtime/library');
const { getPaginationOptions, formatPaginatedResponse } = require('../../utils/pagination.util');

const prisma = new PrismaClient();

const getProviderId = async (userId) => {
  const pp = await prisma.providerProfile.findUnique({ where: { userId }, select: { id: true } });
  return pp ? pp.id : null;
};

// Common includes
const REVIEW_INCLUDE = {
  customer: { select: { id: true, userProfile: { select: { firstName: true, lastName: true, avatarUrl: true } } } },
  provider: { select: { id: true, user: { select: { userProfile: { select: { firstName: true, lastName: true } } } } } },
  reply: true,
};

const getReviews = async (filters = {}) => {
  const where = {};
  if (filters.providerId) where.providerId = filters.providerId;
  if (filters.customerId) where.customerId = filters.customerId;

  const { page, limit, skip, take } = getPaginationOptions(filters);

  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: REVIEW_INCLUDE,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.review.count({ where }),
  ]);

  return formatPaginatedResponse(data, total, page, limit);
};

const createReview = async (customerId, payload) => {
  const { bookingId, rating, comment } = payload;

  // 1. Verify booking exists, is owned by customer, and is COMPLETED
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new AppError('Booking not found', StatusCodes.NOT_FOUND);
  if (booking.customerId !== customerId) throw new AppError('You do not have permission to review this booking', StatusCodes.FORBIDDEN);
  if (booking.status !== 'COMPLETED') throw new AppError('Only completed bookings can be reviewed', StatusCodes.UNPROCESSABLE_ENTITY);

  // 2. Check if already reviewed (handled by schema @unique on bookingId, but good to catch early)
  const existing = await prisma.review.findUnique({ where: { bookingId } });
  if (existing) throw new AppError('You have already reviewed this booking', StatusCodes.CONFLICT);

  // 3. Create Review and update Provider stats in a transaction
  return prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        bookingId,
        customerId,
        providerId: booking.providerId,
        rating,
        comment: comment || null,
      },
      include: REVIEW_INCLUDE,
    });

    // Recalculate provider rating
    const aggregates = await tx.review.aggregate({
      where: { providerId: booking.providerId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const avgRating = aggregates._avg.rating ? new Decimal(aggregates._avg.rating) : new Decimal(0);
    const totalReviews = aggregates._count.rating;

    await tx.providerProfile.update({
      where: { id: booking.providerId },
      data: { avgRating, totalReviews },
    });

    return review;
  });
};

const createReviewReply = async (userId, reviewId, payload) => {
  const providerId = await getProviderId(userId);
  if (!providerId) throw new AppError('Provider profile not found', StatusCodes.FORBIDDEN);

  const review = await prisma.review.findUnique({ where: { id: reviewId }, include: { reply: true } });
  if (!review) throw new AppError('Review not found', StatusCodes.NOT_FOUND);
  if (review.providerId !== providerId) throw new AppError('You can only reply to reviews on your own profile', StatusCodes.FORBIDDEN);
  if (review.reply) throw new AppError('You have already replied to this review', StatusCodes.CONFLICT);

  return prisma.reviewReply.create({
    data: {
      reviewId,
      providerId,
      comment: payload.comment,
    }
  });
};

module.exports = {
  getReviews,
  createReview,
  createReviewReply,
};
