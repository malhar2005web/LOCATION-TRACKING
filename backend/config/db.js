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


pool.connect()
    .then(async client => {
        console.log(' PostgreSQL connected successfully');
        try {
            console.log(' Running database migrations...');
            await client.query(`
                ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
                ALTER TABLE clients ADD COLUMN IF NOT EXISTS pending_sync_count INTEGER DEFAULT 0;
                ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP DEFAULT NULL;

                CREATE TABLE IF NOT EXISTS reminders (
                    id VARCHAR(50) PRIMARY KEY,
                    client_id VARCHAR(50) REFERENCES clients(client_id) ON DELETE CASCADE,
                    client_name VARCHAR(100),
                    contact_person VARCHAR(100),
                    contact_number VARCHAR(20),
                    reminder_type VARCHAR(50),
                    reminder_date DATE,
                    reminder_time TIME,
                    remark TEXT,
                    source_module VARCHAR(20),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    status VARCHAR(20) DEFAULT 'Pending'
                );

                CREATE TABLE IF NOT EXISTS leaves (
                    id VARCHAR(50) PRIMARY KEY,
                    client_id VARCHAR(50) REFERENCES clients(client_id) ON DELETE CASCADE,
                    employee_name VARCHAR(100),
                    leave_type VARCHAR(50),
                    full_half_day VARCHAR(20),
                    start_date DATE,
                    end_date DATE,
                    total_days DECIMAL(5, 2),
                    reason TEXT,
                    in_absence VARCHAR(100),
                    status VARCHAR(20) DEFAULT 'Pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS start_end_days (
                    id SERIAL PRIMARY KEY,
                    client_id VARCHAR(50) REFERENCES clients(client_id) ON DELETE CASCADE,
                    client_name VARCHAR(100),
                    start_time TIMESTAMP NOT NULL,
                    end_time TIMESTAMP,
                    start_lat DECIMAL(10, 7),
                    start_lng DECIMAL(10, 7),
                    end_lat DECIMAL(10, 7),
                    end_lng DECIMAL(10, 7),
                    duration VARCHAR(50),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE INDEX IF NOT EXISTS idx_start_end_days_client_id ON start_end_days(client_id);
                CREATE INDEX IF NOT EXISTS idx_start_end_days_start_time ON start_end_days(start_time);

                CREATE TABLE IF NOT EXISTS dsr_updates (
                    id SERIAL PRIMARY KEY,
                    client_id VARCHAR(50) REFERENCES clients(client_id) ON DELETE CASCADE,
                    client_name VARCHAR(100),
                    customer_name VARCHAR(100),
                    office_address TEXT,
                    site_name VARCHAR(200),
                    contact_person VARCHAR(100),
                    contact_no VARCHAR(20),
                    last_remark TEXT,
                    visited_for VARCHAR(50),
                    followup VARCHAR(100),
                    latitude DECIMAL(10, 7),
                    longitude DECIMAL(10, 7),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE INDEX IF NOT EXISTS idx_dsr_updates_client_id ON dsr_updates(client_id);
                CREATE INDEX IF NOT EXISTS idx_dsr_updates_created_at ON dsr_updates(created_at);
            `);
            console.log(' Database migrations applied successfully');
        } catch (migErr) {
            console.error(' Database migrations failed:', migErr.message);
        } finally {
            client.release();
        }
    })
    .catch(err => {
        console.error(' PostgreSQL connection failed:', err.message);
        console.error('   Make sure PostgreSQL is running and the database exists.');
    });


pool.on('error', (err, client) => {
    console.error('️ Unexpected error on idle client:', err.message);
});

module.exports = pool;
