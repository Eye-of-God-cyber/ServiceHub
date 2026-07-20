const prisma = require('../../src/config/prisma');
const { createTestUser } = require('./auth');

async function createTestProviderAndService() {
  const provider = await createTestUser(`provider.test.${Math.floor(Math.random() * 100000)}@example.com`, 'PROVIDER');
  
  // authService already creates providerProfile with PENDING. We just need to verify it.
  const providerProfile = await prisma.providerProfile.update({
    where: { userId: provider.id },
    data: {
      bio: 'Test bio',
      experienceYears: 5,
      isAvailable: true,
      verificationStatus: 'APPROVED'
    }
  });

  const service = await prisma.service.findFirst();

  const providerService = await prisma.providerService.create({
    data: {
      providerId: providerProfile.id,
      serviceId: service.id,
      customPrice: 500
    }
  });

  return { provider, providerService };
}

async function createTestAddress(userId) {
  return await prisma.address.create({
    data: {
      userId,
      label: 'Home',
      line1: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456'
    }
  });
}

async function createTestCoupon() {
  return await prisma.coupon.create({
    data: {
      code: 'TEST50',
      type: 'PERCENTAGE',
      discountValue: 50,
      maxDiscount: 200,
      minOrderValue: 400,
      validFrom: new Date(Date.now() - 100000), // active
      validUntil: new Date(Date.now() + 10000000),
      maxUsage: 1,
      perUserLimit: 1,
      status: 'ACTIVE'
    }
  });
}

module.exports = {
  createTestProviderAndService,
  createTestAddress,
  createTestCoupon
};

