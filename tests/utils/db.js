// tests/utils/db.js
const bcrypt = require('bcrypt');
async function resetDatabase(prisma) {
  // Execute truncation and seeding in a single interactive transaction
  await prisma.$transaction(async (tx) => {
    // 1. Truncate all tables using raw SQL CASCADE
    // This completely eliminates RESTRICT foreign key violations
    // and is significantly faster than sequential deleteMany() commands.
    await tx.$executeRawUnsafe(`
      TRUNCATE TABLE 
        "test_schema"."roles", "test_schema"."users", "test_schema"."user_roles", 
        "test_schema"."user_profiles", "test_schema"."provider_profiles", 
        "test_schema"."service_categories", "test_schema"."services", 
        "test_schema"."provider_services", "test_schema"."addresses", 
        "test_schema"."bookings", "test_schema"."booking_status_history", 
        "test_schema"."provider_availability", "test_schema"."provider_time_off", 
        "test_schema"."payments", "test_schema"."wallets", "test_schema"."wallet_transactions", 
        "test_schema"."reviews", "test_schema"."review_replies", "test_schema"."disputes", 
        "test_schema"."dispute_messages", "test_schema"."notifications", 
        "test_schema"."coupons", "test_schema"."coupon_usages", "test_schema"."provider_documents", 
        "test_schema"."otp_verifications"
      RESTART IDENTITY CASCADE;
    `);


    // 2. Seed Base Roles
    const adminRole = await tx.role.upsert({ where: { name: 'ADMIN' }, update: {}, create: { name: 'ADMIN' } });
    const customerRole = await tx.role.upsert({ where: { name: 'CUSTOMER' }, update: {}, create: { name: 'CUSTOMER' } });
    const providerRole = await tx.role.upsert({ where: { name: 'PROVIDER' }, update: {}, create: { name: 'PROVIDER' } });

    // 3. Seed Admin User
    const hashedPassword = await bcrypt.hash('Password@123', 1);
    const admin = await tx.user.upsert({
      where: { email: 'admin@servicehub.app' },
      update: {},
      create: {
        id: 'admin-id-uuid',
        email: 'admin@servicehub.app',
        phone: '9999999999',
        passwordHash: hashedPassword,
        status: 'ACTIVE',
        isVerified: true
      }
    });

    await tx.userRole.upsert({
      where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
      update: {},
      create: { userId: admin.id, roleId: adminRole.id }
    });

    const adminProfile = await tx.userProfile.findUnique({ where: { userId: admin.id } });
    if (!adminProfile) {
      await tx.userProfile.create({
        data: { userId: admin.id, firstName: 'System', lastName: 'Admin' }
      });
    }

    // 4. Seed Service Category
    const category = await tx.serviceCategory.upsert({
      where: { name: 'Home Cleaning' },
      update: {},
      create: {
        name: 'Home Cleaning',
        description: 'Standard home cleaning services',
        isActive: true
      }
    });

    // 5. Seed Base Service
    const existingService = await tx.service.findFirst({ where: { name: 'Home Cleaning' } });
    if (!existingService) {
      await tx.service.create({
        data: { categoryId: category.id, name: 'Home Cleaning', description: 'Full', basePrice: 500.00, unit: 'per visit' }
      });
    }

    // 6. Seed Coupon
    await tx.coupon.upsert({
      where: { code: 'TEST10' },
      update: {},
      create: {
        code: 'TEST10',
        type: 'PERCENTAGE',
        discountValue: 10.0,
        maxUsage: 100,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        status: 'ACTIVE'
      }
    });
  }, {
    timeout: 10000 // Increase transaction timeout to 10s for slow networks
  });
}

module.exports = { resetDatabase };
