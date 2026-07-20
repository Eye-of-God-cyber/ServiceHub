const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/prisma');
const { createTestUser, generateToken } = require('../utils/auth');
const { createTestProviderAndService, createTestAddress } = require('../utils/test-helpers');
const walletService = require('../../src/modules/wallets/wallet.service');

describe('Booking Integration Tests', () => {
  let customer, customerToken;
  let provider, providerToken, providerService;
  let address;

  beforeEach(async () => {
    customer = await createTestUser('booking.customer@example.com', 'CUSTOMER');
    customerToken = generateToken(customer);
    
    // Give customer enough money to book
    await walletService.creditWallet(customer.id, 5000, 'Test Wallet Funds');

    const pData = await createTestProviderAndService();
    provider = pData.provider;
    providerToken = generateToken(provider);
    providerService = pData.providerService;

    address = await createTestAddress(customer.id);
  });

  it('should successfully create a booking', async () => {
    const res = await request(app)
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        providerServiceId: providerService.id,
        addressId: address.id,
        scheduledAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        notes: 'Test booking'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.status).toBe('PENDING');

  });


  it('should prevent unauthorized booking creation (Provider trying to book as customer)', async () => {
    const res = await request(app)
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${providerToken}`)
      .send({
        providerServiceId: providerService.id,
        addressId: address.id,
        scheduledAt: new Date(Date.now() + 86400000).toISOString()
      });

    expect(res.statusCode).toEqual(403); // Forbidden
  });

  it('should handle valid and invalid state transitions', async () => {
    // 1. Create Booking
    const createRes = await request(app)
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        providerServiceId: providerService.id,
        addressId: address.id,
        scheduledAt: new Date(Date.now() + 86400000).toISOString()
      });
    const bookingId = createRes.body.data.id;

    // 2. Invalid state transition: Provider tries to mark COMPLETED directly from PENDING
    const invalidTrans = await request(app)
      .patch(`/api/v1/bookings/${bookingId}/status`)
      .set('Authorization', `Bearer ${providerToken}`)
      .send({ status: 'COMPLETED' });
    
    expect(invalidTrans.statusCode).toEqual(422); // Unprocessable Entity (invalid transition)

    // 3. Valid transition: Provider confirms booking
    const confirmRes = await request(app)
      .patch(`/api/v1/bookings/${bookingId}/status`)
      .set('Authorization', `Bearer ${providerToken}`)
      .send({ status: 'CONFIRMED' });
    
    expect(confirmRes.statusCode).toEqual(200);
    expect(confirmRes.body.data.status).toBe('CONFIRMED');

    // 4. Valid transition: Provider starts booking
    await request(app)
      .patch(`/api/v1/bookings/${bookingId}/status`)
      .set('Authorization', `Bearer ${providerToken}`)
      .send({ status: 'IN_PROGRESS' });

    // 5. Valid transition: Provider completes booking
    const completeRes = await request(app)
      .patch(`/api/v1/bookings/${bookingId}/status`)
      .set('Authorization', `Bearer ${providerToken}`)
      .send({ status: 'COMPLETED' });
    
    expect(completeRes.statusCode).toEqual(200);
  });
});
