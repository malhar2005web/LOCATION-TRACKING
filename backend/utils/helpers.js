const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const SALT_ROUNDS = 10;

/**
 * Hash a plaintext password using bcrypt
 */
async function hashPassword(plainPassword) {
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compare a plaintext password against a bcrypt hash
 */
async function comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Generate a unique Client ID in format: CLT-XXXXXX
 */
function generateClientId() {
    const uuid = uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase();
    return `CLT-${uuid}`;
}

/**
 * Generate a JWT token for authenticated users
 * @param {Object} payload - Data to encode in the token
 * @param {string} role - 'client' or 'admin'
 */
function generateToken(payload, role) {
    return jwt.sign(
        { ...payload, role },
        process.env.JWT_SECRET || 'fallback-secret-key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
}

/**
 * Verify a JWT token
 */
function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
}

module.exports = {
    hashPassword,
    comparePassword,
    generateClientId,
    generateToken,
    verifyToken
};
