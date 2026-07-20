const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/prisma');
const { createTestUser, generateToken } = require('../utils/auth');

describe('Notification Integration Tests', () => {
  let user, token;

  beforeEach(async () => {
    user = await createTestUser('notify.user@example.com', 'CUSTOMER');
    token = generateToken(user);

    // Manually inject some notifications
    await prisma.notification.createMany({
      data: [
        {
          userId: user.id,
          title: 'Alert 1',
          body: 'Message 1',
          type: 'SYSTEM',
          isRead: false
        },
        {
          userId: user.id,
          title: 'Alert 2',
          body: 'Message 2',
          type: 'SYSTEM',
          isRead: true
        }
      ]
    });
  });

  it('should list user notifications', async () => {
    const res = await request(app)
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data.some(n => n.isRead === false)).toBe(true);
  });

  it('should mark a notification as read', async () => {
    const listRes = await request(app)
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${token}`);
    
    const notifId = listRes.body.data[0].id;

    const res = await request(app)
      .patch(`/api/v1/notifications/${notifId}/read`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.isRead).toBe(true);

    // Verify only 1 remains unread
    const unreadCount = await prisma.notification.count({ where: { userId: user.id, isRead: false } });
    expect(unreadCount).toBe(1);
  });
});

