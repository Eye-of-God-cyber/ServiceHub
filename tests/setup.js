require('dotenv').config({ path: '.env.test' });

jest.setTimeout(30000); // 30 seconds for DB truncations over Neon


// ─────────────────────────────────────────────────────────
// MANDATORY SAFETY GUARD
// ─────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  console.error('\n❌ CRITICAL: NODE_ENV is not set to "test". Test run aborted to protect production data.\n');
  process.exit(1);
}

if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.includes('schema=test_schema')) {
  console.error('\n❌ CRITICAL: DATABASE_URL does not contain "schema=test_schema". Test run aborted to protect production data.\n');
  process.exit(1);
}

const prisma = require('../src/config/prisma');
const { resetDatabase } = require('./utils/db');

beforeAll(async () => {
  // Ensure the database has the latest schema before tests start
  // In a real CI environment, `prisma migrate deploy` would run before Jest.
  // Here we assume it's already been migrated.
});

beforeEach(async () => {
  // Reset database (truncate all tables and re-seed minimum required data)
  await resetDatabase(prisma);
});

afterAll(async () => {
  await prisma.$disconnect();
});

