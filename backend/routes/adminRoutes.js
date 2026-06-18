const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { comparePassword, generateToken } = require('../utils/helpers');
const { verifyAdmin } = require('../middleware/auth');

/**
 * POST /api/admin/login
 * Admin login with admin_id + password
 * Body: { adminId: string, password: string }
 */
router.post('/login', async (req, res) => {
    try {
        const { adminId, password } = req.body;

        if (!adminId || !password) {
            return res.status(400).json({
                success: false,
                message: 'Admin ID and Password are required.'
            });
        }

        // Find admin
        const result = await db.query(
            'SELECT * FROM admins WHERE admin_id = $1',
            [adminId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Admin ID or Password.'
            });
        }

        const admin = result.rows[0];

        // Verify password
        const isValid = await comparePassword(password, admin.password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Admin ID or Password.'
            });
        }

        // Generate JWT
        const token = generateToken({
            adminId: admin.admin_id,
            name: admin.name
        }, 'admin');

        res.json({
            success: true,
            message: 'Admin has logged in successfully',
            token: token,
            admin: {
                adminId: admin.admin_id,
                name: admin.name
            }
        });

    } catch (err) {
        console.error('Admin login error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error during login.'
        });
    }
});

/**
 * GET /api/admin/clients
 * Get all clients with their latest location
 * Protected: admin only
 */
router.get('/clients', verifyAdmin, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                c.client_id,
                c.device_id,
                c.name,
                c.is_active,
                c.created_at,
                l.latitude AS last_latitude,
                l.longitude AS last_longitude,
                l.timestamp AS last_location_time,
                l.accuracy,
                l.speed,
                l.battery_level
            FROM clients c
            LEFT JOIN LATERAL (
                SELECT latitude, longitude, timestamp, accuracy, speed, battery_level
                FROM locations
                WHERE client_id = c.client_id
                ORDER BY timestamp DESC
                LIMIT 1
            ) l ON TRUE
            ORDER BY c.is_active DESC, l.timestamp DESC NULLS LAST
        `);

        res.json({
            success: true,
            count: result.rows.length,
            clients: result.rows
        });

    } catch (err) {
        console.error('Get clients error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error fetching clients.'
        });
    }
});

/**
 * GET /api/admin/client/:id
 * Get specific client details + location history
 * Protected: admin only
 */
router.get('/client/:id', verifyAdmin, async (req, res) => {
    try {
        const clientId = req.params.id;

        // Get client info
        const clientResult = await db.query(
            'SELECT * FROM clients WHERE client_id = $1',
            [clientId]
        );

        if (clientResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Client not found.'
            });
        }

        const client = clientResult.rows[0];

        // Get location history (last 100 entries)
        const locResult = await db.query(
            `SELECT latitude, longitude, accuracy, speed, bearing, battery_level, timestamp 
             FROM locations 
             WHERE client_id = $1 
             ORDER BY timestamp DESC 
             LIMIT 100`,
            [clientId]
        );

        res.json({
            success: true,
            client: {
                clientId: client.client_id,
                deviceId: client.device_id,
                name: client.name,
                isActive: client.is_active,
                createdAt: client.created_at
            },
            locations: locResult.rows,
            locationCount: locResult.rows.length
        });

    } catch (err) {
        console.error('Get client detail error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error fetching client details.'
        });
    }
});

module.exports = router;
