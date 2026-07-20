const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/prisma');
const { createTestUser, generateToken } = require('../utils/auth');
const walletService = require('../../src/modules/wallets/wallet.service');

describe('Wallet Integration Tests', () => {
  let user;
  let token;

  beforeEach(async () => {
    user = await createTestUser('wallet.test@example.com', 'CUSTOMER');
    token = generateToken(user);
  });

  it('should initialize an empty wallet on first read', async () => {
    const res = await request(app)
      .get('/api/v1/wallets/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.balance).toBe('0');
    expect(res.body.data.transactions.data).toHaveLength(0);
  });

  it('should allow credit and reflect in balance and transactions', async () => {
    // Credit wallet directly via service (since there is no direct endpoint for top-up in this app yet)
    await walletService.creditWallet(user.id, 500, 'Test Credit');

    const res = await request(app)
      .get('/api/v1/wallets/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.balance).toBe('500');
    expect(res.body.data.transactions.data).toHaveLength(1);
    expect(res.body.data.transactions.data[0].amount).toBe('500');
    expect(res.body.data.transactions.data[0].type).toBe('CREDIT');
  });

  it('should allow debit if sufficient funds exist', async () => {
    await walletService.creditWallet(user.id, 500, 'Initial');
    await walletService.debitWallet(user.id, 200, 'Test Debit');

    const res = await request(app)
      .get('/api/v1/wallets/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.balance).toBe('300');
    expect(res.body.data.transactions.data).toHaveLength(2); // Credit + Debit
    expect(res.body.data.transactions.data[0].type).toBe('DEBIT');
  });

  it('should reject debit if insufficient balance', async () => {
    await walletService.creditWallet(user.id, 100, 'Initial');

    await expect(
      walletService.debitWallet(user.id, 200, 'Too large debit')
    ).rejects.toThrow('Insufficient wallet balance');

    // Balance should remain unchanged
    const res = await request(app)
      .get('/api/v1/wallets/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.balance).toBe('100');
  });

  it('TRANSACTION SAFETY: should prevent double-spending in concurrent debit requests', async () => {
    await walletService.creditWallet(user.id, 100, 'Initial');

    // Attempt to debit 100 twice concurrently
    const attempt1 = walletService.debitWallet(user.id, 100, 'Concurrent Debit 1');
    const attempt2 = walletService.debitWallet(user.id, 100, 'Concurrent Debit 2');

    // One should succeed, one should fail
    const results = await Promise.allSettled([attempt1, attempt2]);
    
    const successes = results.filter(r => r.status === 'fulfilled');
    const failures = results.filter(r => r.status === 'rejected');

    expect(successes).toHaveLength(1);
    expect(failures).toHaveLength(1);
    expect(failures[0].reason.message).toBe('Insufficient wallet balance');

    // Final balance should be exactly 0
    const res = await request(app)
      .get('/api/v1/wallets/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.balance).toBe('0');
  });
});

