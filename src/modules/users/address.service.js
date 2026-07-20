'use strict';

const prisma = require('../../config/prisma');
const AppError = require('../../utils/AppError');
const { StatusCodes } = require('http-status-codes');


// ─────────────────────────────────────────────────────────────────────────────
// Shared select — keeps DTO shape consistent across all operations
// ─────────────────────────────────────────────────────────────────────────────
const ADDRESS_SELECT = {
  id: true,
  label: true,
  line1: true,
  line2: true,
  city: true,
  state: true,
  pincode: true,
  latitude: true,
  longitude: true,
  isDefault: true,
  createdAt: true,
  updatedAt: true,
};

// ─────────────────────────────────────────────────────────────────────────────
// assertOwnership(addressId, userId)
// Fetches the address and throws 404 or 403 appropriately.
// Centralising this prevents duplicating the ownership check across every fn.
// ─────────────────────────────────────────────────────────────────────────────
const assertOwnership = async (addressId, userId) => {
  const address = await prisma.address.findUnique({
    where: { id: addressId },
    select: { id: true, userId: true, isDefault: true },
  });

  if (!address) {
    throw new AppError('Address not found.', StatusCodes.NOT_FOUND);
  }

  if (address.userId !== userId) {
    throw new AppError(
      'You do not have permission to access this address.',
      StatusCodes.FORBIDDEN
    );
  }

  return address;
};

// ─────────────────────────────────────────────────────────────────────────────
// getAddresses(userId)
// Returns all addresses for the authenticated user.
// Default address always surfaces first, then newest-first.
// ─────────────────────────────────────────────────────────────────────────────
const getAddresses = async (userId) => {
  return prisma.address.findMany({
    where: { userId },
    select: ADDRESS_SELECT,
    orderBy: [
      { isDefault: 'desc' }, // true (1) before false (0)
      { createdAt: 'desc' },
    ],
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// createAddress(userId, payload)
// Creates a new address.
// Business rule: first address is automatically set as default.
// ─────────────────────────────────────────────────────────────────────────────
const createAddress = async (userId, payload) => {
  const { label, line1, line2, city, state, pincode, latitude, longitude } = payload;

  return prisma.$transaction(async (tx) => {
    // Check if this user already has any addresses
    const count = await tx.address.count({ where: { userId } });
    const isFirstAddress = count === 0;

    const address = await tx.address.create({
      data: {
        userId,
        label: label || null,
        line1,
        line2: line2 || null,
        city,
        state,
        pincode,
        latitude: latitude || null,
        longitude: longitude || null,
        isDefault: isFirstAddress, // Auto-default only if this is the first one
      },
      select: ADDRESS_SELECT,
    });

    return address;
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// updateAddress(addressId, userId, payload)
// Partially updates an address after ownership verification.
// ─────────────────────────────────────────────────────────────────────────────
const updateAddress = async (addressId, userId, payload) => {
  await assertOwnership(addressId, userId);

  const { label, line1, line2, city, state, pincode, latitude, longitude } = payload;

  const data = {};
  if (label     !== undefined) {data.label     = label;}
  if (line1     !== undefined) {data.line1     = line1;}
  if (line2     !== undefined) {data.line2     = line2;}
  if (city      !== undefined) {data.city      = city;}
  if (state     !== undefined) {data.state     = state;}
  if (pincode   !== undefined) {data.pincode   = pincode;}
  if (latitude  !== undefined) {data.latitude  = latitude;}
  if (longitude !== undefined) {data.longitude = longitude;}

  return prisma.address.update({
    where: { id: addressId },
    data,
    select: ADDRESS_SELECT,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// deleteAddress(addressId, userId)
// Business rules:
//   1. Address must belong to the authenticated user.
//   2. Cannot delete the user's only address.
//   3. If deleting the default, atomically promote the next-newest as default.
// ─────────────────────────────────────────────────────────────────────────────
const deleteAddress = async (addressId, userId) => {
  const target = await assertOwnership(addressId, userId);

  // Count ALL addresses for this user
  const totalCount = await prisma.address.count({ where: { userId } });

  if (totalCount === 1) {
    throw new AppError(
      'You must have at least one address. Add another address before deleting this one.',
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  }

  await prisma.$transaction(async (tx) => {
    // If deleting the default address, promote the next newest first
    if (target.isDefault) {
      const nextAddress = await tx.address.findFirst({
        where: { userId, NOT: { id: addressId } },
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      });

      if (nextAddress) {
        await tx.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }

    await tx.address.delete({ where: { id: addressId } });
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// setDefaultAddress(addressId, userId)
// Atomically clears all user's defaults then marks the target as default.
// Transaction ensures no window where zero or two defaults exist.
// ─────────────────────────────────────────────────────────────────────────────
const setDefaultAddress = async (addressId, userId) => {
  await assertOwnership(addressId, userId);

  return prisma.$transaction(async (tx) => {
    // Step 1: Clear existing default(s) for this user
    await tx.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    // Step 2: Set the new default
    return tx.address.update({
      where: { id: addressId },
      data: { isDefault: true },
      select: ADDRESS_SELECT,
    });
  });
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
