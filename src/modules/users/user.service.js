'use strict';

const prisma = require('../../config/prisma');
const AppError = require('../../utils/AppError');
const { StatusCodes } = require('http-status-codes');


// ─────────────────────────────────────────────────────────────────────────────
// Shared Prisma select block
// Used by both getProfile and updateProfile to ensure response shape consistency.
// passwordHash is deliberately absent from every select in this file.
// ─────────────────────────────────────────────────────────────────────────────
const USER_PROFILE_SELECT = {
  id: true,
  email: true,
  phone: true,
  status: true,
  isVerified: true,
  createdAt: true,
  userRoles: {
    select: { role: { select: { name: true } } },
  },
  userProfile: {
    select: {
      firstName: true,
      lastName: true,
      avatarUrl: true,
      dateOfBirth: true,
      updatedAt: true,
    },
  },
  addresses: {
    where: { isDefault: true },
    select: {
      label: true,
      line1: true,
      line2: true,
      city: true,
      state: true,
      pincode: true,
    },
    take: 1,
  },
  wallet: {
    select: { balance: true },
  },
  providerProfile: {
    select: {
      bio: true,
      experienceYears: true,
      verificationStatus: true,
      avgRating: true,
      totalReviews: true,
      totalBookings: true,
      isAvailable: true,
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// buildProfileDto(user)
// Converts a raw Prisma result into a clean, role-aware response DTO.
// ─────────────────────────────────────────────────────────────────────────────
const buildProfileDto = (user) => {
  const primaryRole =
    user.userRoles.length > 0 ? user.userRoles[0].role.name : null;
  const isProvider = primaryRole === 'PROVIDER';

  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    status: user.status,
    isVerified: user.isVerified,
    role: primaryRole,
    createdAt: user.createdAt,
    profile: user.userProfile
      ? {
          firstName: user.userProfile.firstName,
          lastName: user.userProfile.lastName,
          avatarUrl: user.userProfile.avatarUrl || null,
          dateOfBirth: user.userProfile.dateOfBirth || null,
          updatedAt: user.userProfile.updatedAt,
        }
      : null,
    defaultAddress: user.addresses.length > 0 ? user.addresses[0] : null,
    wallet: {
      balance: user.wallet ? user.wallet.balance : '0.00',
    },
    ...(isProvider && {
      providerProfile: user.providerProfile
        ? {
            bio: user.providerProfile.bio,
            experienceYears: user.providerProfile.experienceYears,
            verificationStatus: user.providerProfile.verificationStatus,
            avgRating: user.providerProfile.avgRating,
            totalReviews: user.providerProfile.totalReviews,
            totalBookings: user.providerProfile.totalBookings,
            isAvailable: user.providerProfile.isAvailable,
          }
        : null,
    }),
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// getProfile(userId)
// Fetches the rich profile for the authenticated user.
// ─────────────────────────────────────────────────────────────────────────────
const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: USER_PROFILE_SELECT,
  });

  if (!user) {
    throw new AppError('User profile not found.', StatusCodes.NOT_FOUND);
  }

  return buildProfileDto(user);
};

// ─────────────────────────────────────────────────────────────────────────────
// updateProfile(userId, payload)
// Applies a partial update to the authenticated user's profile.
//
// Design decisions:
//   - userId ALWAYS comes from req.user (set by authenticate middleware).
//   - Client-supplied IDs in the body are never used.
//   - Only the fields present in `payload` are written; absent fields are
//     untouched (partial-update / PATCH semantics on a PUT route).
//   - Phone update goes to the `users` table; all other fields go to
//     `user_profiles`. Both are wrapped in a transaction.
//   - Immutable fields (email, role, status, wallet, etc.) are blocked at the
//     validation layer before this function is ever called.
// ─────────────────────────────────────────────────────────────────────────────
const updateProfile = async (userId, payload) => {
  const { firstName, lastName, dateOfBirth, avatarUrl, phone } = payload;

  // Check phone uniqueness only if caller wants to update it
  if (phone !== undefined) {
    const conflict = await prisma.user.findFirst({
      where: { phone, NOT: { id: userId } },
    });
    if (conflict) {
      throw new AppError('Phone number is already in use by another account.', StatusCodes.CONFLICT);
    }
  }

  // Build only the fields that were actually supplied
  const userProfileData = {};
  if (firstName !== undefined)   {userProfileData.firstName   = firstName;}
  if (lastName !== undefined)    {userProfileData.lastName    = lastName;}
  if (dateOfBirth !== undefined) {userProfileData.dateOfBirth = dateOfBirth;}
  if (avatarUrl !== undefined)   {userProfileData.avatarUrl   = avatarUrl;}

  const userData = {};
  if (phone !== undefined) {userData.phone = phone;}

  // Transaction: update both tables atomically
  await prisma.$transaction(async (tx) => {
    if (Object.keys(userProfileData).length > 0) {
      await tx.userProfile.update({
        where: { userId },
        data: userProfileData,
      });
    }

    if (Object.keys(userData).length > 0) {
      await tx.user.update({
        where: { id: userId },
        data: userData,
      });
    }
  });

  // Re-fetch the full profile using the shared select to return a consistent DTO
  const updated = await prisma.user.findUnique({
    where: { id: userId },
    select: USER_PROFILE_SELECT,
  });

  return buildProfileDto(updated);
};

module.exports = {
  getProfile,
  updateProfile,
};
