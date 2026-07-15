'use strict';

const { PrismaClient } = require('@prisma/client');
const AppError = require('../../utils/AppError');
const { StatusCodes } = require('http-status-codes');
const { Decimal } = require('@prisma/client/runtime/library');

const prisma = new PrismaClient();

/**
 * Ensures a user has a wallet. If not, creates one (idempotent).
 * Returns the wallet record.
 */
const assertWallet = async (userId) => {
  let wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) {
    wallet = await prisma.wallet.create({ data: { userId, balance: 0 } });
  }
  return wallet;
};

const getMyWallet = async (userId, limit = 20) => {
  const wallet = await assertWallet(userId);
  const transactions = await prisma.walletTransaction.findMany({
    where: { walletId: wallet.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return {
    balance: wallet.balance,
    transactions,
  };
};

/**
 * Credits funds to a wallet. Must be run atomically.
 * Returns the created transaction.
 */
const creditWallet = async (userId, amount, description, bookingId = null) => {
  const amt = new Decimal(amount);
  if (amt.lte(0)) {throw new AppError('Credit amount must be positive', StatusCodes.BAD_REQUEST);}

  return prisma.$transaction(async (tx) => {
    // 1. Ensure wallet exists
    let wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await tx.wallet.create({ data: { userId, balance: 0 } });
    }

    // 2. Perform atomic increment
    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: amt } }
    });

    const balanceAfter = new Decimal(updatedWallet.balance);
    const balanceBefore = balanceAfter.minus(amt);

    const txn = await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'CREDIT',
        amount: amt,
        status: 'COMPLETED',
        description,
        bookingId,
        balanceBefore,
        balanceAfter,
      }
    });

    return txn;
  });
};

/**
 * Debits funds from a wallet.
 * Fails if insufficient funds.
 */
const debitWallet = async (userId, amount, description, bookingId = null) => {
  const amt = new Decimal(amount);
  if (amt.lte(0)) {throw new AppError('Debit amount must be positive', StatusCodes.BAD_REQUEST);}

  return prisma.$transaction(async (tx) => {
    let wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await tx.wallet.create({ data: { userId, balance: 0 } });
    }

    // Atomic decrement
    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: amt } }
    });

    const balanceAfter = new Decimal(updatedWallet.balance);
    
    // Check bounds *after* atomic decrement. If negative, roll back the transaction by throwing.
    if (balanceAfter.lt(0)) {
      throw new AppError('Insufficient wallet balance', StatusCodes.UNPROCESSABLE_ENTITY);
    }

    const balanceBefore = balanceAfter.plus(amt);

    const txn = await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'DEBIT',
        amount: amt,
        status: 'COMPLETED',
        description,
        bookingId,
        balanceBefore,
        balanceAfter,
      }
    });

    return txn;
  });
};

module.exports = {
  getMyWallet,
  creditWallet,
  debitWallet,
};
