const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'location_tracker',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

// Test connection on startup
pool.connect()
    .then(client => {
        console.log('✅ PostgreSQL connected successfully');
        client.release();
    })
    .catch(err => {
        console.error('❌ PostgreSQL connection failed:', err.message);
        console.error('   Make sure PostgreSQL is running and the database exists.');
    });

// Handle idle client errors to prevent process crashes
pool.on('error', (err, client) => {
    console.error('⚠️ Unexpected error on idle client:', err.message);
});

module.exports = pool;
