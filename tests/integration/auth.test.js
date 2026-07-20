const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/prisma');

describe('Auth Endpoints', () => {
  it('should register a new CUSTOMER successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test.customer@example.com',
        phone: '9999999990',
        password: 'Password@123',
        firstName: 'Test',
        lastName: 'Customer',
        role: 'CUSTOMER'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.email).toBe('test.customer@example.com');
  });

  it('should prevent duplicate registration', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test.customer2@example.com',
        phone: '9999999991',
        password: 'Password@123',
        firstName: 'Test',
        lastName: 'Customer',
        role: 'CUSTOMER'
      });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test.customer2@example.com', // Duplicate email
        phone: '9999999992',
        password: 'Password@123',
        firstName: 'Test',
        lastName: 'Customer',
        role: 'CUSTOMER'
      });

    expect(res.statusCode).toEqual(409); // Conflict
    expect(res.body.success).toBe(false);
  });

  it('should login an existing user and return tokens', async () => {
    // Create user via register endpoint
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'login.test@example.com',
        phone: '8888888888',
        password: 'Password@123',
        firstName: 'Login',
        lastName: 'User',
        role: 'CUSTOMER'
      });

    // Login
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'login.test@example.com',
        password: 'Password@123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
  });
});

