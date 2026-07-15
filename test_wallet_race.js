'use strict';

const { PrismaClient } = require('@prisma/client');
const { debitWallet } = require('./src/modules/wallets/wallet.service');

const prisma = new PrismaClient();

async function testWalletRace() {
  console.log('--- Testing Wallet Race Condition ---');
  
  // 1. Setup dummy user
  const email = `test_race_${Date.now()}@example.com`;
  const user = await prisma.user.create({
    data: {
      email,
      phone: `+1555${Math.floor(Math.random() * 1000000)}`,
      passwordHash: 'dummy',
      wallet: {
        create: { balance: 100 }
      }
    }
  });
  
  console.log(`Created user with balance 100. ID: ${user.id}`);
  
  try {
    // 2. Fire two debits of 60 concurrently
    console.log('Firing 10 concurrent debits of 20 (total 200) with a balance of 100...');
    const promises = Array(10).fill().map((_, i) => debitWallet(user.id, 20, `Debit ${i}`).catch(e => console.log(`Debit ${i} failed:`, e.message)));
    await Promise.all(promises);
  } catch (err) {
    console.log('Promise.all error (if any):', err.message);
  }

  // 3. Check final balance
  const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
  console.log(`Final balance: ${wallet.balance}`);
  
  const txns = await prisma.walletTransaction.findMany({ where: { walletId: wallet.id } });
  console.log(`Total transactions created: ${txns.length}`);
  for (const t of txns) {
    console.log(` - Transaction: ${t.type} ${t.amount} (Status: ${t.status}) Before: ${t.balanceBefore} After: ${t.balanceAfter}`);
  }
  
  console.log(
    Number(wallet.balance) < 0 || txns.length > 5
      ? '❌ VULNERABLE: Double spend succeeded! Balance: ' + wallet.balance + ' Txns: ' + txns.length
      : '✅ SAFE'
  );
  
  await prisma.$disconnect();
}

testWalletRace().catch(console.error);
