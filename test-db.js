const { PrismaClient } = require('@prisma/client');
const { registerUser } = require('./src/modules/auth/auth.service');
const walletService = require('./src/modules/wallets/wallet.service');

const prisma = new PrismaClient();

async function test() {
  try {
    console.log("Truncating...");
    await prisma.$executeRawUnsafe(`
      TRUNCATE TABLE 
        "test_schema"."roles", "test_schema"."users", "test_schema"."user_roles", 
        "test_schema"."wallets"
      CASCADE;
    `);

    console.log("Seeding role...");
    await prisma.role.upsert({
      where: { name: 'CUSTOMER' },
      update: {},
      create: { name: 'CUSTOMER' }
    });

    console.log("Registering user...");
    const payload = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '1234567890',
      password: 'Password@123',
      role: 'CUSTOMER'
    };
    const user = await registerUser(payload);
    console.log("User created:", user.id);

    console.log("Checking wallet...");
    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    console.log("Found wallet?", !!wallet);

    console.log("Crediting wallet...");
    await walletService.creditWallet(user.id, 5000, 'Test Funds');
    console.log("Credit successful.");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
