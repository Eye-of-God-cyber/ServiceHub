'use strict';

const { PrismaClient } = require('@prisma/client');
const { createBooking } = require('./src/modules/bookings/booking.service');

const prisma = new PrismaClient();

async function testCouponRace() {
  console.log('--- Testing Coupon Race Condition ---');
  
  // 1. Setup mock data
  const email = `test_coupon_${Date.now()}@example.com`;
  const customer = await prisma.user.create({
    data: {
      email,
      phone: `+1555${Math.floor(Math.random() * 1000000)}`,
      passwordHash: 'dummy',
    }
  });

  const category = await prisma.serviceCategory.create({ data: { name: `Cat_${Date.now()}` } });
  const service = await prisma.service.create({ data: { categoryId: category.id, name: `Service_${Date.now()}`, basePrice: 100 } });
  
  const provider = await prisma.user.create({
    data: {
      email: `prov_${Date.now()}@example.com`,
      phone: `+1555${Math.floor(Math.random() * 1000000)}`,
      passwordHash: 'dummy',
      providerProfile: { create: {} }
    },
    include: { providerProfile: true }
  });

  const providerService = await prisma.providerService.create({
    data: { providerId: provider.providerProfile.id, serviceId: service.id, customPrice: 100, isAvailable: true }
  });

  const address = await prisma.address.create({
    data: { userId: customer.id, line1: '123 Test', city: 'City', state: 'State', pincode: '12345' }
  });

  const coupon = await prisma.coupon.create({
    data: {
      code: `LIMIT2_${Date.now()}`,
      type: 'FLAT',
      discountValue: 10,
      maxUsage: 2,
      usageCount: 0,
      status: 'ACTIVE',
      validFrom: new Date(Date.now() - 10000),
      validUntil: new Date(Date.now() + 100000),
    }
  });
  
  console.log(`Created coupon ${coupon.code} with maxUsage: 2`);
  
  try {
    // 2. Fire 5 concurrent bookings using the same coupon
    console.log('Firing 5 concurrent bookings with the same coupon...');
    const promises = Array(5).fill().map((_, i) => createBooking(customer.id, {
      providerServiceId: providerService.id,
      addressId: address.id,
      scheduledAt: new Date(Date.now() + 86400000), // tomorrow
      notes: 'Test',
      couponId: coupon.id
    }).catch(e => console.log(`Booking ${i} failed:`, e.message)));
    
    await Promise.all(promises);
  } catch (err) {
    console.log('Promise.all error (if any):', err.message);
  }

  // 3. Check final coupon usage
  const updatedCoupon = await prisma.coupon.findUnique({ where: { id: coupon.id } });
  console.log(`Final coupon usage count: ${updatedCoupon.usageCount}`);
  
  const usages = await prisma.couponUsage.findMany({ where: { couponId: coupon.id } });
  console.log(`Total coupon usages recorded: ${usages.length}`);
  
  console.log(
    updatedCoupon.usageCount > 2 
      ? `❌ VULNERABLE: Coupon used ${updatedCoupon.usageCount} times (limit was 2)!`
      : '✅ SAFE: Coupon limit respected.'
  );
  
  await prisma.$disconnect();
}

testCouponRace().catch(console.error);
