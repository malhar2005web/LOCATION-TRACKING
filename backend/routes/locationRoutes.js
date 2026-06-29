const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyClient } = require('../middleware/auth');

router.post('/update', async (req, res) => {
    try {
        const {
            clientId,
            deviceId,
            latitude,
            longitude,
            timestamp,
            accuracy,
            speed,
            bearing,
            batteryLevel
        } = req.body;

        if (!clientId || !deviceId || latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                success: false,
                message: 'clientId, deviceId, latitude, and longitude are required.'
            });
        }

        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({
                success: false,
                message: 'Invalid latitude or longitude values.'
            });
        }

        const locationTime = timestamp ? new Date(timestamp) : new Date();

        await db.query(
            `INSERT INTO locations 
                (client_id, device_id, latitude, longitude, accuracy, speed, bearing, battery_level, timestamp) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
                clientId,
                deviceId,
                latitude,
                longitude,
                accuracy || null,
                speed || null,
                bearing || null,
                batteryLevel || null,
                locationTime
            ]
        );

        const pendingSyncCount = req.body.pendingSyncCount !== undefined ? parseInt(req.body.pendingSyncCount) : 0;
        await db.query(
            `UPDATE clients 
             SET is_active = TRUE, 
                 last_seen = NOW(), 
                 last_synced_at = NOW(), 
                 pending_sync_count = $2, 
                 updated_at = NOW() 
             WHERE client_id = $1`,
            [clientId, pendingSyncCount]
        );

        res.json({
            success: true,
            message: 'Location updated successfully.',
            recorded: {
                clientId,
                latitude,
                longitude,
                timestamp: locationTime.toISOString()
            }
        });

    } catch (err) {
        console.error('Location update error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error saving location.'
        });
    }
});

router.post('/batch', async (req, res) => {
    try {
        const { locations } = req.body;

        if (!locations || !Array.isArray(locations) || locations.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'locations array is required.'
            });
        }

        const client = await db.connect();
        try {
            await client.query('BEGIN');

            for (const loc of locations) {
                await client.query(
                    `INSERT INTO locations 
                        (client_id, device_id, latitude, longitude, accuracy, speed, bearing, battery_level, timestamp) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                    [
                        loc.clientId,
                        loc.deviceId,
                        loc.latitude,
                        loc.longitude,
                        loc.accuracy || null,
                        loc.speed || null,
                        loc.bearing || null,
                        loc.batteryLevel || null,
                        loc.timestamp ? new Date(loc.timestamp) : new Date()
                    ]
                );
            }

            const pendingSyncCount = req.body.pendingSyncCount !== undefined ? parseInt(req.body.pendingSyncCount) : 0;
            const clientIds = [...new Set(locations.map(l => l.clientId))];
            for (const cid of clientIds) {
                await client.query(
                    `UPDATE clients 
                     SET is_active = TRUE, 
                         last_seen = NOW(), 
                         last_synced_at = NOW(), 
                         pending_sync_count = $2, 
                         updated_at = NOW() 
                     WHERE client_id = $1`,
                    [cid, pendingSyncCount]
                );
            }

            await client.query('COMMIT');
        } catch (txErr) {
            await client.query('ROLLBACK');
            throw txErr;
        } finally {
            client.release();
        }

        res.json({
            success: true,
            message: `${locations.length} locations saved successfully.`,
            count: locations.length
        });

    } catch (err) {
        console.error('Batch location error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error saving batch locations.'
        });
    }
});

module.exports = router;
