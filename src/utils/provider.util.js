'use strict';

const prisma = require('../config/prisma');
const AppError = require('./AppError');
const { StatusCodes } = require('http-status-codes');

// ─────────────────────────────────────────────────────────────────────────────
// getProviderId(userId)
//
// Shared helper used by every service that needs to resolve a provider's
// integer profile ID from their UUID user ID.
//
// Previously copy-pasted across 6 service files:
//   booking.service.js, disputes/dispute.service.js,
//   providers/availability.service.js, providers/document.service.js,
//   providers/providerService.service.js, reviews/review.service.js
//
// Centralised here so the DB query exists in exactly one place.
// Throws 404 if no provider profile exists for the given userId.
// Returns the provider profile integer id.
// ─────────────────────────────────────────────────────────────────────────────
const getProviderId = async (userId) => {
  const pp = await prisma.providerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!pp) {
    throw new AppError('Provider profile not found.', StatusCodes.NOT_FOUND);
  }
  return pp.id;
};

// ─────────────────────────────────────────────────────────────────────────────
// getProviderIdOrNull(userId)
//
// Soft variant — returns null instead of throwing when no profile exists.
// Used by services that need to check "is this user a provider?" without
// raising an error if they are not (e.g., booking ownership checks).
// ─────────────────────────────────────────────────────────────────────────────
const getProviderIdOrNull = async (userId) => {
  const pp = await prisma.providerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  return pp ? pp.id : null;
};

module.exports = { getProviderId, getProviderIdOrNull };
