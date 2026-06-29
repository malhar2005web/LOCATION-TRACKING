-- ============================================
-- Location Tracker  PostgreSQL Database Schema
-- ============================================

-- Run this after creating the 'location_tracker' database in pgAdmin

-- ============================================
-- Admins table
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    admin_id VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) DEFAULT 'Administrator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Clients table
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    client_id VARCHAR(50) UNIQUE NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    name VARCHAR(100) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pending_sync_count INTEGER DEFAULT 0,
    last_synced_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_clients_device_id ON clients(device_id);
CREATE INDEX IF NOT EXISTS idx_clients_is_active ON clients(is_active);

-- ============================================
-- Locations table (GPS tracking history)
-- ============================================
CREATE TABLE IF NOT EXISTS locations (
    id BIGSERIAL PRIMARY KEY,
    client_id VARCHAR(50) NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    accuracy REAL DEFAULT NULL,
    speed REAL DEFAULT NULL,
    bearing REAL DEFAULT NULL,
    battery_level REAL DEFAULT NULL,
    timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_locations_client_id ON locations(client_id);
CREATE INDEX IF NOT EXISTS idx_locations_timestamp ON locations(timestamp);
CREATE INDEX IF NOT EXISTS idx_locations_client_timestamp ON locations(client_id, timestamp DESC);

-- ============================================
-- Auto-update updated_at trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_admins_updated_at
    BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trigger_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Seed default admin account
-- Password: admin123 (bcrypt hashed)
-- ============================================
INSERT INTO admins (admin_id, password, name)
VALUES ('admin', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQkHft/vKSvNPJ2UWd6B0oUg6slYWa', 'Super Admin')
ON CONFLICT (admin_id) DO NOTHING;

-- ============================================
-- Reminders table
-- ============================================
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

CREATE INDEX IF NOT EXISTS idx_reminders_client_id ON reminders(client_id);
CREATE INDEX IF NOT EXISTS idx_reminders_date ON reminders(reminder_date);
CREATE INDEX IF NOT EXISTS idx_reminders_status ON reminders(status);

-- ============================================
-- Leaves table
-- ============================================
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

CREATE INDEX IF NOT EXISTS idx_leaves_client_id ON leaves(client_id);
CREATE INDEX IF NOT EXISTS idx_leaves_start_date ON leaves(start_date);
CREATE INDEX IF NOT EXISTS idx_leaves_status ON leaves(status);

-- ============================================
-- Start End Days table (workday activity)
-- ============================================
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

-- ============================================
-- DSR Updates table (daily sales reports history)
-- ============================================
CREATE TABLE IF NOT EXISTS dsr_updates (
    id SERIAL PRIMARY KEY,
    client_id VARCHAR(50) REFERENCES clients(client_id) ON DELETE CASCADE,
    client_name VARCHAR(100), -- Visited by
    customer_name VARCHAR(100), -- Client/Customer name
    office_address TEXT,
    site_name VARCHAR(200),
    contact_person VARCHAR(100),
    contact_no VARCHAR(20),
    last_remark TEXT,
    visited_for VARCHAR(50), -- Status/visited for
    followup VARCHAR(100), -- Follow-up datetime string
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dsr_updates_client_id ON dsr_updates(client_id);
CREATE INDEX IF NOT EXISTS idx_dsr_updates_created_at ON dsr_updates(created_at);
