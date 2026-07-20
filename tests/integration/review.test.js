const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/prisma');
const { createTestUser, generateToken } = require('../utils/auth');
const { createTestProviderAndService, createTestAddress } = require('../utils/test-helpers');
const walletService = require('../../src/modules/wallets/wallet.service');

describe('Review Integration Tests', () => {
  let customer, customerToken;
  let providerToken, providerService;
  let address;
  let bookingId;

  beforeEach(async () => {
    customer = await createTestUser('review.customer@example.com', 'CUSTOMER');
    customerToken = generateToken(customer);
    await walletService.creditWallet(customer.id, 5000, 'Test Wallet Funds');

    const pData = await createTestProviderAndService();
    providerToken = generateToken(pData.provider);
    providerService = pData.providerService;
    address = await createTestAddress(customer.id);

    // Create a booking
    const bookingRes = await request(app)
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        providerServiceId: providerService.id,
        addressId: address.id,
        scheduledAt: new Date(Date.now() + 86400000).toISOString()
      });
    bookingId = bookingRes.body.data.id;
  });

  it('should reject review if booking is not COMPLETED', async () => {
    const res = await request(app)
      .post('/api/v1/reviews')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        bookingId: bookingId,
        rating: 5,
        comment: 'Great service'
      });

    expect(res.statusCode).toEqual(422); // Unprocessable Entity
    expect(res.body.message).toMatch(/only completed bookings/i);
  });

  it('should allow review after booking is COMPLETED and prevent duplicates', async () => {
    // Transition to COMPLETED
    await request(app).patch(`/api/v1/bookings/${bookingId}/status`).set('Authorization', `Bearer ${providerToken}`).send({ status: 'CONFIRMED' });
    await request(app).patch(`/api/v1/bookings/${bookingId}/status`).set('Authorization', `Bearer ${providerToken}`).send({ status: 'IN_PROGRESS' });
    await request(app).patch(`/api/v1/bookings/${bookingId}/status`).set('Authorization', `Bearer ${providerToken}`).send({ status: 'COMPLETED' });

    // 1st Review Attempt
    const res1 = await request(app)
      .post('/api/v1/reviews')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        bookingId: bookingId,
        rating: 5,
        comment: 'Great service'
      });

    expect(res1.statusCode).toEqual(201);
    expect(res1.body.success).toBe(true);

    // 2nd Review Attempt
    const res2 = await request(app)
      .post('/api/v1/reviews')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        bookingId: bookingId,
        rating: 4,
        comment: 'Wait, let me change this'
      });

    expect(res2.statusCode).toEqual(409); // Conflict
    expect(res2.body.message).toMatch(/already reviewed/i);
  });
});

