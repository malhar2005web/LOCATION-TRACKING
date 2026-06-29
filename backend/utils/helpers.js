const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const SALT_ROUNDS = 10;


async function hashPassword(plainPassword) {
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
}


async function comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}


function generateClientId() {
    const uuid = uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase();
    return `CLT-${uuid}`;
}


function generateToken(payload, role) {
    return jwt.sign(
        { ...payload, role },
        process.env.JWT_SECRET || 'fallback-secret-key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
}


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
