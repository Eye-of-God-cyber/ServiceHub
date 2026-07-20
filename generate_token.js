const prisma = require('./src/config/prisma');
const { generateAccessToken } = require('./src/utils/jwt.util');

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("No user found");
    process.exit(1);
  }
  // Passing payload as object
  const token = generateAccessToken({ id: user.id });
  console.log(token);
}

main().catch(console.error).finally(() => prisma.$disconnect());
