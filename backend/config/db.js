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

// Test connection on startup and run self-migrations
pool.connect()
    .then(async client => {
        console.log('✅ PostgreSQL connected successfully');
        try {
            console.log('🔄 Running database migrations...');
            await client.query(`
                ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
                ALTER TABLE clients ADD COLUMN IF NOT EXISTS pending_sync_count INTEGER DEFAULT 0;
                ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP DEFAULT NULL;
            `);
            console.log('✅ Database migrations applied successfully');
        } catch (migErr) {
            console.error('❌ Database migrations failed:', migErr.message);
        } finally {
            client.release();
        }
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
