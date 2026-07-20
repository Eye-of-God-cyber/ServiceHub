// tests/utils/auth.js
const jwt = require('jsonwebtoken');
const authService = require('../../src/modules/auth/auth.service');
const prisma = require('../../src/config/prisma');

const JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';

async function createTestUser(email, role = 'CUSTOMER') {
  const phone = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
  
  // Use the actual service so all relations (profiles, wallet, roles) are correctly formed
  const user = await authService.registerUser({
    email,
    phone,
    password: 'Password@123',
    firstName: 'Test',
    lastName: 'User',
    role
  });

  // Fetch full user record since authService returns a stripped version
  const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
  
  // Manually attach role string since generateToken needs it
  fullUser.role = role;
  
  return fullUser;
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
}

module.exports = {
  createTestUser,
  generateToken
};

