'use strict';

const { PrismaClient } = require('@prisma/client');
const AppError = require('../../utils/AppError');
const { StatusCodes } = require('http-status-codes');

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────────────────────
// Shared Prisma select — consistent DTO shape across GET and PUT.
// passwordHash is structurally absent. Internal IDs and system stats are
// exposed only where they aid the provider's own dashboard.
// ─────────────────────────────────────────────────────────────────────────────
const PROVIDER_PROFILE_SELECT = {
  id: true,
  email: true,
  phone: true,
  status: true,
  isVerified: true,
  userProfile: {
    select: {
      firstName: true,
      lastName: true,
      avatarUrl: true,
      dateOfBirth: true,
      updatedAt: true,
    },
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
      updatedAt: true,
    },
  },
  wallet: {
    select: { balance: true },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// buildProviderDto(user)
// Maps the raw Prisma result to a clean, flat response DTO.
// ─────────────────────────────────────────────────────────────────────────────
const buildProviderDto = (user) => ({
  id: user.id,
  email: user.email,
  phone: user.phone,
  status: user.status,
  isVerified: user.isVerified,
  profile: user.userProfile
    ? {
        firstName: user.userProfile.firstName,
        lastName:  user.userProfile.lastName,
        avatarUrl: user.userProfile.avatarUrl  || null,
        dateOfBirth: user.userProfile.dateOfBirth || null,
        updatedAt: user.userProfile.updatedAt,
      }
    : null,
  providerProfile: user.providerProfile
    ? {
        bio:                user.providerProfile.bio,
        experienceYears:    user.providerProfile.experienceYears,
        verificationStatus: user.providerProfile.verificationStatus,
        avgRating:          user.providerProfile.avgRating,
        totalReviews:       user.providerProfile.totalReviews,
        totalBookings:      user.providerProfile.totalBookings,
        isAvailable:        user.providerProfile.isAvailable,
        updatedAt:          user.providerProfile.updatedAt,
      }
    : null,
  wallet: {
    balance: user.wallet ? user.wallet.balance : '0.00',
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// assertProviderProfile(userId)
// Fetches the user and confirms a ProviderProfile record exists.
// Used by both getProviderProfile and updateProviderProfile to avoid duplication.
// ─────────────────────────────────────────────────────────────────────────────
const assertProviderProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: PROVIDER_PROFILE_SELECT,
  });

  if (!user) {
    throw new AppError('User not found.', StatusCodes.NOT_FOUND);
  }

  if (!user.providerProfile) {
    // This should not happen in normal operation — every PROVIDER user has a
    // ProviderProfile created atomically during registration. If it's missing,
    // something went wrong at the data layer.
    throw new AppError(
      'Provider profile not found. Please contact support.',
      StatusCodes.NOT_FOUND
    );
  }

  return user;
};

// ─────────────────────────────────────────────────────────────────────────────
// getProviderProfile(userId)
// Fetches the authenticated provider's full profile.
// ─────────────────────────────────────────────────────────────────────────────
const getProviderProfile = async (userId) => {
  const user = await assertProviderProfile(userId);
  return buildProviderDto(user);
};

// ─────────────────────────────────────────────────────────────────────────────
// updateProviderProfile(userId, payload)
// Applies partial updates to the provider's editable fields across two tables
// (user_profiles and provider_profiles) inside a single transaction.
//
// Ownership is guaranteed: userId always comes from req.user (set by the
// authenticate middleware) — never from the request body or URL params.
// Immutable fields are already blocked by the validation layer before this runs.
// ─────────────────────────────────────────────────────────────────────────────
const updateProviderProfile = async (userId, payload) => {
  await assertProviderProfile(userId); // confirms record exists before writing

  const {
    bio,
    experienceYears,
    isAvailable,
    // UserProfile fields
    firstName,
    lastName,
    avatarUrl,
  } = payload;

  // Build sparse update objects — only write fields that were actually supplied
  const providerData = {};
  if (bio               !== undefined) {providerData.bio             = bio;}
  if (experienceYears   !== undefined) {providerData.experienceYears = experienceYears;}
  if (isAvailable       !== undefined) {providerData.isAvailable     = isAvailable;}

  const userProfileData = {};
  if (firstName !== undefined) {userProfileData.firstName = firstName;}
  if (lastName  !== undefined) {userProfileData.lastName  = lastName;}
  if (avatarUrl !== undefined) {userProfileData.avatarUrl = avatarUrl;}

  // Atomic update across both tables
  await prisma.$transaction(async (tx) => {
    if (Object.keys(providerData).length > 0) {
      await tx.providerProfile.update({
        where: { userId },
        data:  providerData,
      });
    }

    if (Object.keys(userProfileData).length > 0) {
      await tx.userProfile.update({
        where: { userId },
        data:  userProfileData,
      });
    }
  });

  // Re-fetch via the shared select to return a consistent DTO
  const updated = await prisma.user.findUnique({
    where:  { id: userId },
    select: PROVIDER_PROFILE_SELECT,
  });

  return buildProviderDto(updated);
};

module.exports = {
  getProviderProfile,
  updateProviderProfile,
};
