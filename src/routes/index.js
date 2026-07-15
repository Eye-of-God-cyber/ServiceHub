'use strict';

const express = require('express');

// ─────────────────────────────────────────────────────────
// Central Route Registry
//
// All module routers are registered here and mounted under /api/v1.
// This file is the single source of truth for the API's URL surface.
//
// Adding a new module:
//   1. Create src/modules/<name>/<name>.routes.js
//   2. Import and mount it below.
//   3. The module's Swagger JSDoc annotations are auto-discovered
//      by the glob pattern in src/config/swagger.js.
// ─────────────────────────────────────────────────────────

const router = express.Router();

// ───────────────── Module Routes ─────────────────────────────────────────────
const healthRoutes   = require('../modules/health/health.routes');
const authRoutes     = require('../modules/auth/auth.routes');
const userRoutes     = require('../modules/users/user.routes');
const providerRoutes = require('../modules/providers/provider.routes');
const catalogRoutes  = require('../modules/catalog/catalog.routes');
const bookingRoutes  = require('../modules/bookings/booking.routes');
const walletRoutes   = require('../modules/wallets/wallet.routes');
const reviewRoutes   = require('../modules/reviews/review.routes');
const notificationRoutes = require('../modules/notifications/notification.routes');
const disputeRoutes  = require('../modules/disputes/dispute.routes');
const adminRoutes    = require('../modules/admin/admin.routes');

// Mount routes — prefix is relative to /api/v1 (set in app.js)
router.use('/health',    healthRoutes);
router.use('/auth',      authRoutes);
router.use('/users',     userRoutes);
router.use('/providers', providerRoutes);
router.use('/catalog',   catalogRoutes);
router.use('/bookings',  bookingRoutes);
router.use('/wallets',   walletRoutes);
router.use('/reviews',   reviewRoutes);
router.use('/notifications', notificationRoutes);
router.use('/disputes',  disputeRoutes);
router.use('/admin',     adminRoutes);

// Future modules will be mounted here in upcoming milestones:
// router.use('/providers',     providerRoutes);
// router.use('/admin',         adminRoutes);
// router.use('/categories',    categoryRoutes);
// router.use('/services',      serviceRoutes);
// router.use('/bookings',      bookingRoutes);
// router.use('/payments',      paymentRoutes);
// router.use('/reviews',       reviewRoutes);
// router.use('/disputes',      disputeRoutes);
// router.use('/notifications', notificationRoutes);
// router.use('/coupons',       couponRoutes);

module.exports = router;
