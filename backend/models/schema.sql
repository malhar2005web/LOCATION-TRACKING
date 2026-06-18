-- ============================================
-- Location Tracker — PostgreSQL Database Schema
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
