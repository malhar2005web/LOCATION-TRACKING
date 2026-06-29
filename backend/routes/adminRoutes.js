const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { comparePassword, generateToken } = require('../utils/helpers');
const { verifyAdmin } = require('../middleware/auth');

router.post('/login', async (req, res) => {
    try {
        const { adminId, password } = req.body;

        if (!adminId || !password) {
            return res.status(400).json({
                success: false,
                message: 'Admin ID and Password are required.'
            });
        }

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

        const isValid = await comparePassword(password, admin.password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Admin ID or Password.'
            });
        }

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

router.get('/clients', verifyAdmin, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                c.client_id,
                c.device_id,
                c.name,
                c.is_active,
                c.last_seen,
                c.pending_sync_count,
                c.last_synced_at,
                (SELECT COUNT(*) FROM locations WHERE client_id = c.client_id) AS total_locations,
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
            ORDER BY c.last_seen DESC NULLS LAST, c.client_id
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

router.get('/client/:id', verifyAdmin, async (req, res) => {
    try {
        const clientId = req.params.id;

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

        const locResult = await db.query(
            `SELECT latitude, longitude, accuracy, speed, bearing, battery_level, timestamp 
             FROM locations 
             WHERE client_id = $1 
             ORDER BY timestamp DESC 
             LIMIT 100`,
            [clientId]
        );

        const totalCountResult = await db.query('SELECT COUNT(*) FROM locations WHERE client_id = $1', [clientId]);
        const totalLocations = parseInt(totalCountResult.rows[0].count) || 0;

        res.json({
            success: true,
            client: {
                clientId: client.client_id,
                deviceId: client.device_id,
                name: client.name,
                isActive: client.is_active,
                lastSeen: client.last_seen,
                pendingSyncCount: client.pending_sync_count,
                lastSyncedAt: client.last_synced_at,
                totalLocations: totalLocations,
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

router.get('/leaves', verifyAdmin, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                l.*,
                COALESCE(c.name, l.employee_name, l.client_id) AS employee_name
            FROM leaves l
            LEFT JOIN clients c ON c.client_id = l.client_id
            ORDER BY l.created_at DESC
        `);

        res.json({ success: true, leaves: result.rows });
    } catch (err) {
        console.error('Get admin leaves error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error fetching leave requests.'
        });
    }
});

router.get('/dsr-recent', verifyAdmin, async (req, res) => {
    try {
        const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);
        const result = await db.query(
            'SELECT id, client_id, client_name, customer_name, site_name, contact_person, contact_no, last_remark, visited_for, followup, latitude, longitude, created_at FROM dsr_updates ORDER BY created_at DESC LIMIT $1',
            [limit]
        );

        res.json({ success: true, count: result.rows.length, records: result.rows });
    } catch (err) {
        console.error('Get dsr-recent error:', err);
        res.status(500).json({ success: false, message: 'Server error fetching recent DSR updates.' });
    }
});

module.exports = router;
