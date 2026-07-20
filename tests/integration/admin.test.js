const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/prisma');
const { createTestUser, generateToken } = require('../utils/auth');

describe('Admin Integration Tests', () => {
  let admin, adminToken;
  let provider, documentId;

  beforeEach(async () => {
    admin = await prisma.user.findUnique({ where: { email: 'admin@servicehub.app' } });
    if (!admin) {
      admin = await createTestUser('admin2@servicehub.app', 'ADMIN');
    }
    adminToken = generateToken(admin);

    provider = await createTestUser('admin.provider@example.com', 'PROVIDER');
    const providerProfile = await prisma.providerProfile.update({
      where: { userId: provider.id },
      data: {
        bio: 'Test',
        verificationStatus: 'PENDING'
      }
    });
    console.log('Provider Profile ID:', providerProfile.id);

    try {
      const docs = await prisma.$queryRaw`
        INSERT INTO test_schema.provider_documents (provider_id, document_type, document_url, status, updated_at)
        VALUES (${providerProfile.id}, 'ID_PROOF', 'fake.png', 'PENDING', NOW())
        RETURNING id
      `;
      documentId = docs[0].id;
    } catch (e) {
      console.error('FAILED TO CREATE DOC:', e);
      throw e;
    }
  });

  it('should allow admin to approve a provider document', async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/documents/${documentId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'APPROVED', adminNotes: 'Looks good' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);

    const doc = await prisma.providerDocument.findUnique({ where: { id: documentId } });
    expect(doc.status).toBe('APPROVED');
  });
});

