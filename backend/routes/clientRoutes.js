const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { comparePassword, generateClientId, generateToken } = require('../utils/helpers');

/**
 * POST /api/client/register
 * Register a new client with auto-generated Client ID
 * Body: { deviceId: string, name?: string }
 */
router.post('/register', async (req, res) => {
    try {
        const { deviceId, name } = req.body;

        if (!deviceId) {
            return res.status(400).json({
                success: false,
                message: 'Device ID is required.'
            });
        }

        // Check if device is already registered
        const existing = await db.query(
            'SELECT client_id FROM clients WHERE device_id = $1',
            [deviceId]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'This device is already registered.',
                clientId: existing.rows[0].client_id
            });
        }

        // Generate unique client ID
        let clientId;
        let isUnique = false;
        while (!isUnique) {
            clientId = generateClientId();
            const check = await db.query(
                'SELECT id FROM clients WHERE client_id = $1',
                [clientId]
            );
            if (check.rows.length === 0) isUnique = true;
        }

        // Insert new client
        await db.query(
            'INSERT INTO clients (client_id, device_id, name) VALUES ($1, $2, $3)',
            [clientId, deviceId, name || null]
        );

        res.status(201).json({
            success: true,
            message: 'Client registered successfully.',
            clientId: clientId,
            deviceId: deviceId
        });

    } catch (err) {
        console.error('Client register error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error during registration.'
        });
    }
});

/**
 * POST /api/client/login
 * Client login with client_id + device_id
 * Body: { clientId: string, deviceId: string }
 */
router.post('/login', async (req, res) => {
    try {
        const { clientId, deviceId } = req.body;

        if (!clientId || !deviceId) {
            return res.status(400).json({
                success: false,
                message: 'Client ID and Device ID are required.'
            });
        }

        // Validate client credentials
        const result = await db.query(
            'SELECT * FROM clients WHERE client_id = $1 AND device_id = $2',
            [clientId, deviceId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Client ID or Device ID.'
            });
        }

        const client = result.rows[0];

        // Update active status
        await db.query(
            'UPDATE clients SET is_active = TRUE, updated_at = NOW() WHERE client_id = $1',
            [clientId]
        );

        // Generate JWT
        const token = generateToken({
            clientId: client.client_id,
            deviceId: client.device_id
        }, 'client');

        res.json({
            success: true,
            message: 'Client has logged in successfully',
            token: token,
            client: {
                clientId: client.client_id,
                deviceId: client.device_id,
                name: client.name,
                createdAt: client.created_at
            }
        });

    } catch (err) {
        console.error('Client login error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error during login.'
        });
    }
});

/**
 * POST /api/client/logout
 * Mark client as inactive
 */
router.post('/logout', async (req, res) => {
    try {
        const { clientId } = req.body;

        if (clientId) {
            await db.query(
                'UPDATE clients SET is_active = FALSE, updated_at = NOW() WHERE client_id = $1',
                [clientId]
            );
        }

        res.json({
            success: true,
            message: 'Client logged out successfully.'
        });

    } catch (err) {
        console.error('Client logout error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error during logout.'
        });
    }
});

module.exports = router;
