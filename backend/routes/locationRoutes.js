const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyClient } = require('../middleware/auth');

/**
 * POST /api/location/update
 * Receive location data from client device
 * Body: { clientId, deviceId, latitude, longitude, timestamp, accuracy?, speed?, bearing?, batteryLevel? }
 */
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

        // Validate required fields
        if (!clientId || !deviceId || latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                success: false,
                message: 'clientId, deviceId, latitude, and longitude are required.'
            });
        }

        // Validate coordinate ranges
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({
                success: false,
                message: 'Invalid latitude or longitude values.'
            });
        }

        // Use provided timestamp or current time
        const locationTime = timestamp ? new Date(timestamp) : new Date();

        // Insert location record
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

        // Update client activity timestamp
        await db.query(
            'UPDATE clients SET is_active = TRUE, updated_at = NOW() WHERE client_id = $1',
            [clientId]
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

/**
 * POST /api/location/batch
 * Receive multiple location records at once (for offline sync)
 * Body: { locations: Array<{ clientId, deviceId, latitude, longitude, timestamp, ... }> }
 */
router.post('/batch', async (req, res) => {
    try {
        const { locations } = req.body;

        if (!locations || !Array.isArray(locations) || locations.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'locations array is required.'
            });
        }

        // Use a transaction for batch insert
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

            // Update client activity
            const clientIds = [...new Set(locations.map(l => l.clientId))];
            for (const cid of clientIds) {
                await client.query(
                    'UPDATE clients SET is_active = TRUE, updated_at = NOW() WHERE client_id = $1',
                    [cid]
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
