'use strict';

const { PrismaClient } = require('@prisma/client');
const { hashPassword, comparePassword } = require('../../utils/password.util');
const { generateAccessToken } = require('../../utils/jwt.util');
const AppError = require('../../utils/AppError');
const { StatusCodes } = require('http-status-codes');

const prisma = new PrismaClient();

/**
 * Register a new User (Customer or Provider).
 * Encapsulates the entire registration process inside a Prisma Transaction
 * to ensure all linked tables are created atomically or fully rolled back on failure.
 * 
 * @param {Object} payload 
 * @param {string} payload.firstName
 * @param {string} payload.lastName
 * @param {string} payload.email
 * @param {string} payload.phone
 * @param {string} payload.password
 * @param {string} payload.role - 'CUSTOMER' | 'PROVIDER'
 */
const registerUser = async ({ firstName, lastName, email, phone, password, role }) => {
  // 1. Hard block Admin Registration
  if (role === 'ADMIN') {
    throw new AppError('Admin registration is strictly prohibited via this endpoint.', StatusCodes.FORBIDDEN);
  }

  // 2. Check duplicate email (Fast check before transaction)
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    throw new AppError('Email is already registered.', StatusCodes.CONFLICT);
  }

  // 2. Check duplicate phone
  const existingPhone = await prisma.user.findUnique({ where: { phone } });
  if (existingPhone) {
    throw new AppError('Phone number is already registered.', StatusCodes.CONFLICT);
  }

  // 3. Find the target Role ID
  const dbRole = await prisma.role.findUnique({ where: { name: role } });
  if (!dbRole) {
    throw new AppError(`Role ${role} is invalid or not seeded in database.`, StatusCodes.INTERNAL_SERVER_ERROR);
  }

  // 4. Hash Password
  const passwordHash = await hashPassword(password);

  // 5. Execute unified transaction
  const newUser = await prisma.$transaction(async (tx) => {
    // a. Create base user
    const user = await tx.user.create({
      data: {
        email,
        phone,
        passwordHash,
        status: 'ACTIVE',
        isVerified: false,
      },
    });

    // b. Assign Role
    await tx.userRole.create({
      data: {
        userId: user.id,
        roleId: dbRole.id,
      },
    });

    // c. Create User Profile
    await tx.userProfile.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
      },
    });

    // d. Create Wallet
    await tx.wallet.create({
      data: {
        userId: user.id,
        balance: 0.00,
      },
    });

    // e. Create Address placeholder
    await tx.address.create({
      data: {
        userId: user.id,
        line1: 'Please update your address',
        city: 'Unknown',
        state: 'Unknown',
        pincode: '000000',
        isDefault: true,
      },
    });

    // f. Create ProviderProfile if role is PROVIDER
    if (role === 'PROVIDER') {
      await tx.providerProfile.create({
        data: {
          userId: user.id,
          verificationStatus: 'PENDING',
          isAvailable: false, // Must be approved first
        },
      });
    }

    return user;
  });

  return {
    id: newUser.id,
    email: newUser.email,
    phone: newUser.phone,
    role: role,
    status: newUser.status,
    createdAt: newUser.createdAt,
  };
};

/**
 * Authenticate a user and generate an Access Token.
 * 
 * @param {Object} payload
 * @param {string} payload.email
 * @param {string} payload.password
 */
const loginUser = async ({ email, password }) => {
  // 1. Find user by email
  // We include userRoles and role to embed into the JWT payload.
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      userRoles: {
        include: { role: true }
      }
    }
  });

  // 2. Mitigate timing attacks by computing a dummy hash if user is not found
  // This ensures the response time is roughly identical whether the email exists or not.
  const dummyHash = '$2b$10$SSery3znSOC2XPW8bLp3hehXxJaT8a4JvsxbhsOpo6KVVIv47MVYq';
  const targetHash = user ? user.passwordHash : dummyHash;

  // 3. Verify password
  const isPasswordValid = await comparePassword(password, targetHash);
  
  if (!user || !isPasswordValid) {
    throw new AppError('Invalid email or password.', StatusCodes.UNAUTHORIZED);
  }

  // 4. Check account status
  if (user.status === 'SUSPENDED') {
    throw new AppError('Your account has been suspended. Please contact support.', StatusCodes.FORBIDDEN);
  }
  if (user.status === 'INACTIVE') {
    throw new AppError('Your account is currently inactive. Please verify your email or contact support.', StatusCodes.FORBIDDEN);
  }

  // 5. Load user's primary role (assuming 1 role per user for standard MVP)
  // If a user has multiple roles, you could map them all. We'll pick the first.
  const primaryRole = user.userRoles.length > 0 ? user.userRoles[0].role.name : 'CUSTOMER';

  // 6. Generate Access Token (minimal payload)
  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: primaryRole
  };
  
  const accessToken = generateAccessToken(tokenPayload);

  // 7. Return safe authenticated user details + token
  return {
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: primaryRole,
      status: user.status
    }
  };
};

/**
 * Fetch the authenticated user's rich profile.
 * The authenticate middleware has already verified the JWT and
 * attached req.user (a lightweight db record). Here we do a
 * second, intentional query to return a full, role-aware DTO.
 * This keeps the middleware lean and the response purposeful.
 *
 * @param {string} userId - Verified user ID from req.user
 */
const getMe = async (userId) => {
  // Re-fetch from DB — never trust the JWT payload as the source of truth.
  // A user's profile, status or role may have changed since the token was issued.
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      phone: true,
      status: true,
      isVerified: true,
      createdAt: true,
      // passwordHash intentionally omitted
      userRoles: {
        select: {
          role: {
            select: { name: true },
          },
        },
      },
      userProfile: {
        select: {
          firstName: true,
          lastName: true,
          avatarUrl: true,
          dateOfBirth: true,
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
        select: {
          balance: true,
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
        },
      },
    },
  });

  if (!user) {
    throw new AppError('User no longer exists.', StatusCodes.UNAUTHORIZED);
  }

  const primaryRole =
    user.userRoles.length > 0 ? user.userRoles[0].role.name : 'CUSTOMER';
  const isProvider = primaryRole === 'PROVIDER';

  // Build clean DTO — only include providerProfile for PROVIDER accounts
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

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
