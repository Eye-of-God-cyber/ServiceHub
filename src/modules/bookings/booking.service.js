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

// Common include for detailed booking views
const BOOKING_INCLUDE = {
  customer: { select: { id: true, email: true, userProfile: { select: { firstName: true, lastName: true, avatarUrl: true } } } },
  provider: { select: { id: true, bio: true, user: { select: { email: true, phone: true, userProfile: { select: { firstName: true, lastName: true } } } } } },
  service: { select: { id: true, name: true, unit: true, imageUrl: true } },
  address: { select: { line1: true, line2: true, city: true, state: true, pincode: true } },
};

const getBookings = async (userId, userRoles, filters = {}) => {
  const where = {};
  
  if (filters.status) {
    where.status = filters.status;
  }

  const orConditions = [];

  if (userRoles.includes('CUSTOMER')) {
    orConditions.push({ customerId: userId });
  }

  if (userRoles.includes('PROVIDER')) {
    const providerId = await getProviderId(userId);
    if (providerId) {
      orConditions.push({ providerId });
    }
  }

  if (orConditions.length === 0 && !userRoles.includes('ADMIN')) {
    return []; // No relevant roles
  }

  // Admins see all, otherwise use OR scoping
  if (orConditions.length > 0) {
    where.OR = orConditions;
  }

  const { page, limit, skip, take } = getPaginationOptions(filters);

  const [data, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: BOOKING_INCLUDE,
      orderBy: { scheduledAt: 'desc' },
      skip,
      take,
    }),
    prisma.booking.count({ where }),
  ]);

  return formatPaginatedResponse(data, total, page, limit);
};

const getBookingById = async (userId, userRoles, bookingId) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: BOOKING_INCLUDE,
  });

  if (!booking) {
    throw new AppError('Booking not found', StatusCodes.NOT_FOUND);
  }

  if (userRoles.includes('ADMIN')) {return booking;}

  let isOwner = false;
  if (userRoles.includes('CUSTOMER') && booking.customerId === userId) {
    isOwner = true;
  }
  if (!isOwner && userRoles.includes('PROVIDER')) {
    const providerId = await getProviderId(userId);
    if (providerId && booking.providerId === providerId) {
      isOwner = true;
    }
  }

  if (!isOwner) {
    throw new AppError('You do not have permission to view this booking', StatusCodes.FORBIDDEN);
  }

  return booking;
};

const createBooking = async (customerId, payload) => {
  const { providerServiceId, addressId, scheduledAt, notes, couponId } = payload;

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address) {throw new AppError('Address not found', StatusCodes.NOT_FOUND);}
  if (address.userId !== customerId) {
    throw new AppError('You do not have permission to use this address', StatusCodes.FORBIDDEN);
  }

  const ps = await prisma.providerService.findUnique({
    where: { id: providerServiceId },
    include: { service: true }
  });

  if (!ps) {throw new AppError('Provider service not found', StatusCodes.NOT_FOUND);}
  if (!ps.isAvailable || !ps.service.isActive) {
    throw new AppError('This service is currently unavailable', StatusCodes.UNPROCESSABLE_ENTITY);
  }

  const baseAmount = ps.customPrice !== null ? new Decimal(ps.customPrice) : new Decimal(ps.service.basePrice);
  let discountAmount = new Decimal(0);

  if (couponId) {
    const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
    if (!coupon) {throw new AppError('Coupon not found', StatusCodes.NOT_FOUND);}
    
    const now = new Date();
    if (coupon.status !== 'ACTIVE' || coupon.validFrom > now || coupon.validUntil < now) {
      throw new AppError('Coupon is inactive or expired', StatusCodes.UNPROCESSABLE_ENTITY);
    }
    // Remove the unsynchronized usage check from here, we will do it atomically later.
    
    if (coupon.minOrderValue !== null && baseAmount.lt(new Decimal(coupon.minOrderValue))) {
      throw new AppError(`Minimum order value of ${coupon.minOrderValue} required for this coupon`, StatusCodes.UNPROCESSABLE_ENTITY);
    }

    if (coupon.type === 'FLAT') {
      discountAmount = new Decimal(coupon.discountValue);
    } else if (coupon.type === 'PERCENTAGE') {
      const percentage = new Decimal(coupon.discountValue).dividedBy(100);
      let calculatedDiscount = baseAmount.times(percentage);
      if (coupon.maxDiscount !== null && calculatedDiscount.gt(new Decimal(coupon.maxDiscount))) {
        calculatedDiscount = new Decimal(coupon.maxDiscount);
      }
      discountAmount = calculatedDiscount;
    }

    if (discountAmount.gt(baseAmount)) {
      discountAmount = baseAmount;
    }
  }

  const totalAmount = baseAmount.minus(discountAmount);

  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.create({
      data: {
        customerId,
        providerId: ps.providerId,
        serviceId: ps.serviceId,
        providerServiceId,
        addressId,
        scheduledAt,
        notes,
        couponId: couponId || null,
        baseAmount,
        discountAmount,
        totalAmount,
      }
    });

    if (couponId) {
      const updatedCoupon = await tx.coupon.update({
        where: { id: couponId },
        data: { usageCount: { increment: 1 } }
      });
      
      // Atomic bound check
      if (updatedCoupon.maxUsage !== null && updatedCoupon.usageCount > updatedCoupon.maxUsage) {
        throw new AppError('Coupon usage limit reached', StatusCodes.UNPROCESSABLE_ENTITY);
      }

      await tx.couponUsage.create({
        data: {
          couponId,
          userId: customerId,
          bookingId: booking.id,
        }
      });
    }

    return tx.booking.findUnique({
      where: { id: booking.id },
      include: BOOKING_INCLUDE,
    });
  });
};

const updateBookingStatus = async (userId, userRoles, bookingId, payload) => {
  const { status, cancellationReason } = payload;
  const booking = await getBookingById(userId, userRoles, bookingId); // reusing ownership logic

  const isAdmin = userRoles.includes('ADMIN');
  let isCustomer = false;
  let isProvider = false;
  
  if (userRoles.includes('CUSTOMER') && booking.customerId === userId) {isCustomer = true;}
  
  if (userRoles.includes('PROVIDER') && !isCustomer) {
    const providerId = await getProviderId(userId);
    if (providerId && booking.providerId === providerId) {isProvider = true;}
  }

  // Define allowed transitions
  // PENDING -> CONFIRMED (Provider)
  // PENDING -> CANCELLED (Customer, Provider)
  // CONFIRMED -> CANCELLED (Customer, Provider)
  // CONFIRMED -> IN_PROGRESS (Provider)
  // IN_PROGRESS -> COMPLETED (Provider)
  // IN_PROGRESS -> NO_SHOW (Provider)
  // Admin can do anything
  
  if (!isAdmin) {
    const current = booking.status;
    const invalidTransition = () => {
      throw new AppError(`Cannot transition booking from ${current} to ${status} as a ${isCustomer ? 'Customer' : 'Provider'}`, StatusCodes.UNPROCESSABLE_ENTITY);
    };

    if (isCustomer) {
      if (status === 'CANCELLED') {
        if (current !== 'PENDING' && current !== 'CONFIRMED') {invalidTransition();}
      } else {
        invalidTransition();
      }
    } else if (isProvider) {
      if (status === 'CONFIRMED' && current !== 'PENDING') {invalidTransition();}
      if (status === 'IN_PROGRESS' && current !== 'CONFIRMED') {invalidTransition();}
      if (status === 'COMPLETED' && current !== 'IN_PROGRESS') {invalidTransition();}
      if (status === 'NO_SHOW' && current !== 'IN_PROGRESS') {invalidTransition();}
      if (status === 'CANCELLED' && current !== 'PENDING' && current !== 'CONFIRMED') {invalidTransition();}
    }
  }

  const data = { status };
  if (status === 'CANCELLED' && cancellationReason) {
    data.cancellationReason = cancellationReason;
  }
  if (status === 'COMPLETED') {
    data.completedAt = new Date();
  }

  return prisma.$transaction(async (tx) => {
    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data,
      include: BOOKING_INCLUDE,
    });

    await tx.bookingStatusHistory.create({
      data: {
        bookingId: updatedBooking.id,
        status: updatedBooking.status,
        changedById: userId,
        reason: cancellationReason || `Status changed to ${status}`,
      }
    });

    return updatedBooking;
  });
};

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
};
