'use strict';

const express = require('express');
const router  = express.Router();

const walletController = require('./wallet.controller');
const authenticate     = require('../../middleware/auth.middleware');

// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /wallets/me:
 *   get:
 *     summary: Get current user's wallet
 *     description: Retrieves the current balance and recent transactions for the authenticated user's wallet.
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet fetched successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
// ─────────────────────────────────────────────────────────────────────────────
// All authenticated users can view their wallet
router.get(
  '/me',
  authenticate,
  walletController.getMyWallet
);

module.exports = router;
