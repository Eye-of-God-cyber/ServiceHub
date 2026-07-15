'use strict';

const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../config/auth.constants');

/**
 * Hashes a plaintext password securely.
 * 
 * Uses bcrypt with configured SALT_ROUNDS.
 * Salt rounds dictate the complexity and time required to generate the hash.
 * A higher number (e.g., 12) increases security against brute-force/rainbow table attacks,
 * but requires more CPU power. 10-12 is standard for modern hardware.
 * 
 * @param {string} plainTextPassword - The raw password provided by the user.
 * @returns {Promise<string>} The securely hashed password.
 */
const hashPassword = async (plainTextPassword) => {
  return await bcrypt.hash(plainTextPassword, SALT_ROUNDS);
};

/**
 * Compares a plaintext password against a stored bcrypt hash.
 * 
 * @param {string} plainTextPassword - The raw password provided by the user.
 * @param {string} hashedPassword - The hash stored in the database.
 * @returns {Promise<boolean>} True if they match, false otherwise.
 */
const comparePassword = async (plainTextPassword, hashedPassword) => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
