const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/prisma');
const { createTestUser, generateToken } = require('../utils/auth');
const { createTestProviderAndService, createTestAddress, createTestCoupon } = require('../utils/test-helpers');
const walletService = require('../../src/modules/wallets/wallet.service');

describe('Coupon Integration Tests', () => {
  let customer, customerToken;
  let providerService, address, coupon;

  beforeEach(async () => {
    customer = await createTestUser('coupon.customer@example.com', 'CUSTOMER');
    customerToken = generateToken(customer);
    await walletService.creditWallet(customer.id, 5000, 'Test Wallet Funds');

    const pData = await createTestProviderAndService();
    providerService = pData.providerService;
    address = await createTestAddress(customer.id);
    coupon = await createTestCoupon();
  });

  it('should successfully apply a valid coupon to a booking', async () => {
    const res = await request(app)
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        providerServiceId: providerService.id,
        addressId: address.id,
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        couponId: coupon.id
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);

  });

  it('should fail to apply an expired coupon', async () => {
    // Modify coupon to be expired
    await prisma.coupon.update({
      where: { id: coupon.id },
      data: { validUntil: new Date(Date.now() - 1000) }
    });

    const res = await request(app)
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        providerServiceId: providerService.id,
        addressId: address.id,
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        couponId: coupon.id
      });

    expect(res.statusCode).toEqual(422);
    expect(res.body.message).toMatch(/expired|invalid/i);
  });

  it('TRANSACTION SAFETY: should prevent coupon usage limit bypass on concurrent bookings', async () => {
    // The coupon created in beforeEach has usageLimit = 1.
    // If we fire two booking requests concurrently with the same coupon, only ONE should succeed.
    
    const req1 = request(app)
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        providerServiceId: providerService.id,
        addressId: address.id,
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        couponId: coupon.id
      });

    const req2 = request(app)
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        providerServiceId: providerService.id,
        addressId: address.id,
        scheduledAt: new Date(Date.now() + 86400000 + 1000).toISOString(),
        couponId: coupon.id
      });

    const [res1, res2] = await Promise.all([req1, req2]);

    const successes = [res1, res2].filter(r => r.statusCode === 201);
    const failures = [res1, res2].filter(r => r.statusCode === 400 || r.statusCode === 422);

    expect(successes).toHaveLength(1);
    expect(failures).toHaveLength(1);

    // Ensure coupon usage in DB is exactly 1
    const usages = await prisma.couponUsage.count({ where: { couponId: coupon.id } });
    expect(usages).toBe(1);
  });
});

