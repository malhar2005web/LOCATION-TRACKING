const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { comparePassword, generateClientId, generateToken } = require('../utils/helpers');
const { verifyClient, verifyAuth } = require('../middleware/auth');

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

        // 1. Validate client credentials
        let result = await db.query(
            'SELECT * FROM clients WHERE client_id = $1',
            [clientId]
        );

        const { name, userfullname, user_fullname } = req.body;
        const dynamicName = (name || userfullname || user_fullname || '').trim();

        if (result.rows.length === 0) {
            const clientName = dynamicName || `Client ${clientId}`;
            console.log(`[Login] Auto-creating client ${clientId} (${clientName}) with device ${deviceId}`);
            await db.query(
                'INSERT INTO clients (client_id, device_id, name) VALUES ($1, $2, $3)',
                [clientId, deviceId, clientName]
            );
            result = await db.query(
                'SELECT * FROM clients WHERE client_id = $1 AND device_id = $2',
                [clientId, deviceId]
            );
        } else {
            const existingClient = result.rows[0];
            if (dynamicName && (existingClient.name !== dynamicName || existingClient.name === `Client ${clientId}`)) {
                await db.query(
                    'UPDATE clients SET name = $2, updated_at = NOW() WHERE client_id = $1',
                    [clientId, dynamicName]
                );
            }
            // Only reject login if the user is ALREADY active (logged in) on a different device
            if (existingClient.is_active && existingClient.device_id !== deviceId) {
                return res.status(409).json({
                    success: false,
                    message: 'This user is already logged in from another device.'
                });
            }

            // If they are not active (logged out), allow login on the new device and update their device_id
            if (existingClient.device_id !== deviceId) {
                console.log(`[Login] Updating device ID for client ${clientId} from ${existingClient.device_id} to ${deviceId}`);
                await db.query(
                    'UPDATE clients SET device_id = $2, updated_at = NOW() WHERE client_id = $1',
                    [clientId, deviceId]
                );
                // Refresh the query result
                result = await db.query(
                    'SELECT * FROM clients WHERE client_id = $1',
                    [clientId]
                );
            }
        }

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

/**
 * POST /api/client/reminder
 * Create or update a reminder
 */
router.post('/reminder', verifyClient, async (req, res) => {
    try {
        const {
            id,
            client_name,
            contact_person,
            contact_number,
            reminder_type,
            reminder_date,
            reminder_time,
            remark,
            source_module,
            status
        } = req.body;

        const clientId = req.user.clientId;

        if (!id) {
            return res.status(400).json({ success: false, message: 'id is required' });
        }

        const query = `
            INSERT INTO reminders 
                (id, client_id, client_name, contact_person, contact_number, reminder_type, reminder_date, reminder_time, remark, source_module, status, updated_at)
            VALUES 
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
            ON CONFLICT (id) DO UPDATE SET
                client_name = EXCLUDED.client_name,
                contact_person = EXCLUDED.contact_person,
                contact_number = EXCLUDED.contact_number,
                reminder_type = EXCLUDED.reminder_type,
                reminder_date = EXCLUDED.reminder_date,
                reminder_time = EXCLUDED.reminder_time,
                remark = EXCLUDED.remark,
                source_module = EXCLUDED.source_module,
                status = EXCLUDED.status,
                updated_at = NOW();
        `;

        await db.query(query, [
            id,
            clientId,
            client_name || null,
            contact_person || null,
            contact_number || null,
            reminder_type || null,
            reminder_date || null,
            reminder_time || null,
            remark || null,
            source_module || null,
            status || 'Pending'
        ]);

        res.json({ success: true, message: 'Reminder saved successfully.' });
    } catch (err) {
        console.error('Save reminder error:', err);
        res.status(500).json({ success: false, message: 'Server error saving reminder.' });
    }
});

/**
 * POST /api/client/reminder/batch
 * Sync multiple reminders at once (offline sync support)
 */
router.post('/reminder/batch', verifyClient, async (req, res) => {
    try {
        const { reminders } = req.body;
        const clientId = req.user.clientId;

        if (!reminders || !Array.isArray(reminders)) {
            return res.status(400).json({ success: false, message: 'reminders array is required.' });
        }

        const client = await db.connect();
        try {
            await client.query('BEGIN');
            const query = `
                INSERT INTO reminders 
                    (id, client_id, client_name, contact_person, contact_number, reminder_type, reminder_date, reminder_time, remark, source_module, status, updated_at)
                VALUES 
                    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
                ON CONFLICT (id) DO UPDATE SET
                    client_name = EXCLUDED.client_name,
                    contact_person = EXCLUDED.contact_person,
                    contact_number = EXCLUDED.contact_number,
                    reminder_type = EXCLUDED.reminder_type,
                    reminder_date = EXCLUDED.reminder_date,
                    reminder_time = EXCLUDED.reminder_time,
                    remark = EXCLUDED.remark,
                    source_module = EXCLUDED.source_module,
                    status = EXCLUDED.status,
                    updated_at = NOW();
            `;

            for (const rem of reminders) {
                await client.query(query, [
                    rem.id,
                    clientId,
                    rem.client_name || null,
                    rem.contact_person || null,
                    rem.contact_number || null,
                    rem.reminder_type || null,
                    rem.reminder_date || null,
                    rem.reminder_time || null,
                    rem.remark || null,
                    rem.source_module || null,
                    rem.status || 'Pending'
                ]);
            }
            await client.query('COMMIT');
        } catch (txErr) {
            await client.query('ROLLBACK');
            throw txErr;
        } finally {
            client.release();
        }

        res.json({ success: true, message: `Synced ${reminders.length} reminders successfully.` });
    } catch (err) {
        console.error('Batch sync reminders error:', err);
        res.status(500).json({ success: false, message: 'Server error batch syncing reminders.' });
    }
});

/**
 * GET /api/client/reminders
 * Retrieve all reminders for active client
 */
router.get('/reminders', verifyClient, async (req, res) => {
    try {
        const clientId = req.user.clientId;
        const result = await db.query(
            'SELECT * FROM reminders WHERE client_id = $1 ORDER BY reminder_date ASC, reminder_time ASC',
            [clientId]
        );
        res.json({ success: true, reminders: result.rows });
    } catch (err) {
        console.error('Get reminders error:', err);
        res.status(500).json({ success: false, message: 'Server error retrieving reminders.' });
    }
});

/**
 * PUT /api/client/reminder/:id/status
 * Update status of a specific reminder
 */
router.put('/reminder/:id/status', verifyClient, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const clientId = req.user.clientId;

        if (!status) {
            return res.status(400).json({ success: false, message: 'status is required.' });
        }

        await db.query(
            'UPDATE reminders SET status = $1, updated_at = NOW() WHERE id = $2 AND client_id = $3',
            [status, id, clientId]
        );

        res.json({ success: true, message: 'Reminder status updated.' });
    } catch (err) {
        console.error('Update status error:', err);
        res.status(500).json({ success: false, message: 'Server error updating status.' });
    }
});

/**
 * POST /api/client/leave
 * Apply or update a leave request
 */
router.post('/leave', verifyClient, async (req, res) => {
    try {
        const {
            id,
            leave_type,
            full_half_day,
            start_date,
            end_date,
            total_days,
            reason,
            in_absence,
            status,
            employee_name
        } = req.body;

        const clientId = req.user.clientId;
        const name = employee_name || req.user.name || 'Client';

        if (!id) {
            return res.status(400).json({ success: false, message: 'id is required.' });
        }

        const query = `
            INSERT INTO leaves 
                (id, client_id, employee_name, leave_type, full_half_day, start_date, end_date, total_days, reason, in_absence, status, updated_at)
            VALUES 
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
            ON CONFLICT (id) DO UPDATE SET
                leave_type = EXCLUDED.leave_type,
                full_half_day = EXCLUDED.full_half_day,
                start_date = EXCLUDED.start_date,
                end_date = EXCLUDED.end_date,
                total_days = EXCLUDED.total_days,
                reason = EXCLUDED.reason,
                in_absence = EXCLUDED.in_absence,
                status = EXCLUDED.status,
                updated_at = NOW();
        `;

        await db.query(query, [
            id,
            clientId,
            name,
            leave_type || null,
            full_half_day || null,
            start_date || null,
            end_date || null,
            total_days || 0.0,
            reason || null,
            in_absence || null,
            status || 'Pending'
        ]);

        res.json({ success: true, message: 'Leave request saved successfully.' });
    } catch (err) {
        console.error('Save leave error:', err);
        res.status(500).json({ success: false, message: 'Server error saving leave request.' });
    }
});

/**
 * GET /api/client/leaves
 * Retrieve leave history for active client
 */
router.get('/leaves', verifyClient, async (req, res) => {
    try {
        const clientId = req.user.clientId;
        const result = await db.query(
            'SELECT * FROM leaves WHERE client_id = $1 ORDER BY created_at DESC',
            [clientId]
        );
        res.json({ success: true, leaves: result.rows });
    } catch (err) {
        console.error('Get leaves error:', err);
        res.status(500).json({ success: false, message: 'Server error retrieving leave history.' });
    }
});

/**
 * DELETE /api/client/leave/:id
 * Cancel or update status of leave request to Cancelled
 */
router.delete('/leave/:id', verifyClient, async (req, res) => {
    try {
        const { id } = req.params;
        const clientId = req.user.clientId;

        await db.query(
            "UPDATE leaves SET status = 'Cancelled', updated_at = NOW() WHERE id = $1 AND client_id = $2",
            [id, clientId]
        );

        res.json({ success: true, message: 'Leave request cancelled successfully.' });
    } catch (err) {
        console.error('Cancel leave error:', err);
        res.status(500).json({ success: false, message: 'Server error cancelling leave request.' });
    }
});

/**
 * POST /api/client/day-start
 * Record workday start locally
 */
router.post('/day-start', verifyClient, async (req, res) => {
    try {
        const clientId = req.user.clientId;
        const { start_time, start_lat, start_lng, client_name } = req.body;

        if (!start_time) {
            return res.status(400).json({ success: false, message: 'start_time is required.' });
        }

        // Fetch client name from DB if not provided
        let name = client_name;
        if (!name) {
            const clientRes = await db.query('SELECT name FROM clients WHERE client_id = $1', [clientId]);
            name = (clientRes.rows[0] && clientRes.rows[0].name) || clientId;
        }

        // Close any dangling open days
        await db.query(
            "UPDATE start_end_days SET end_time = start_time, duration = '00 min' WHERE client_id = $1 AND end_time IS NULL",
            [clientId]
        );

        // Insert new day start
        await db.query(
            "INSERT INTO start_end_days (client_id, client_name, start_time, start_lat, start_lng) VALUES ($1, $2, $3, $4, $5)",
            [clientId, name, start_time, start_lat || 0.0, start_lng || 0.0]
        );

        res.json({ success: true, message: 'Day start recorded locally.' });
    } catch (err) {
        console.error('Record day start error:', err);
        res.status(500).json({ success: false, message: 'Server error recording day start.' });
    }
});

/**
 * POST /api/client/day-end
 * Record workday end locally
 */
router.post('/day-end', verifyClient, async (req, res) => {
    try {
        const clientId = req.user.clientId;
        const { end_time, end_lat, end_lng, duration } = req.body;

        if (!end_time) {
            return res.status(400).json({ success: false, message: 'end_time is required.' });
        }

        // Find the latest open workday for this client
        const openDay = await db.query(
            'SELECT id FROM start_end_days WHERE client_id = $1 AND end_time IS NULL ORDER BY start_time DESC LIMIT 1',
            [clientId]
        );

        if (openDay.rows.length > 0) {
            await db.query(
                'UPDATE start_end_days SET end_time = $1, end_lat = $2, end_lng = $3, duration = $4 WHERE id = $5',
                [end_time, end_lat || 0.0, end_lng || 0.0, duration || '00 min', openDay.rows[0].id]
            );
        } else {
            // If no open day, insert a closed one
            let name = req.user.name;
            if (!name) {
                const clientRes = await db.query('SELECT name FROM clients WHERE client_id = $1', [clientId]);
                name = (clientRes.rows[0] && clientRes.rows[0].name) || clientId;
            }
            await db.query(
                'INSERT INTO start_end_days (client_id, client_name, start_time, end_time, start_lat, start_lng, end_lat, end_lng, duration) VALUES ($1, $2, $3, $3, $4, $5, $4, $5, $6)',
                [clientId, name, end_time, end_lat || 0.0, end_lng || 0.0, duration || '00 min']
            );
        }

        res.json({ success: true, message: 'Day end recorded locally.' });
    } catch (err) {
        console.error('Record day end error:', err);
        res.status(500).json({ success: false, message: 'Server error recording day end.' });
    }
});

/**
 * POST /api/client/dsr-update
 * Record DSR update locally
 */
router.post('/dsr-update', verifyClient, async (req, res) => {
    try {
        const clientId = req.user.clientId;
        const {
            customer_name,
            office_address,
            site_name,
            contact_person,
            contact_no,
            last_remark,
            visited_for,
            followup,
            latitude,
            longitude,
            client_name
        } = req.body;

        if (!customer_name) {
            return res.status(400).json({ success: false, message: 'customer_name is required.' });
        }

        // Fetch client name from DB if not provided
        let name = client_name;
        if (!name) {
            const clientRes = await db.query('SELECT name FROM clients WHERE client_id = $1', [clientId]);
            name = (clientRes.rows[0] && clientRes.rows[0].name) || clientId;
        }

        await db.query(
            `INSERT INTO dsr_updates 
                (client_id, client_name, customer_name, office_address, site_name, contact_person, contact_no, last_remark, visited_for, followup, latitude, longitude)
             VALUES 
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [
                clientId,
                name,
                customer_name,
                office_address || null,
                site_name || null,
                contact_person || null,
                contact_no || null,
                last_remark || null,
                visited_for || 'Others',
                followup || null,
                latitude || 0.0,
                longitude || 0.0
            ]
        );

        res.json({ success: true, message: 'DSR record saved locally.' });
    } catch (err) {
        console.error('Record DSR error:', err);
        res.status(500).json({ success: false, message: 'Server error saving DSR record.' });
    }
});

/**
 * GET /api/client/users
 * Retrieve all registered users for reports filters (available to both Clients and Admins)
 */
router.get('/users', verifyAuth, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT client_id, COALESCE(name, client_id) AS name FROM clients ORDER BY name ASC, client_id ASC'
        );
        res.json({ success: true, users: result.rows });
    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({ success: false, message: 'Server error retrieving users list.' });
    }
});

/**
 * GET /api/client/reports/start-end
 * Get Start End Day Report data
 */
router.get('/reports/start-end', verifyAuth, async (req, res) => {
    try {
        const { clientId, fromDate, tillDate } = req.query;
        let query = `SELECT id, client_id, client_name, start_time, end_time, start_lat, start_lng, end_lat, end_lng, duration FROM start_end_days WHERE 1=1`;
        const params = [];

        if (clientId && clientId !== 'All') {
            params.push(clientId);
            query += ` AND client_id = $${params.length}`;
        }

        if (fromDate) {
            params.push(fromDate + ' 00:00:00');
            query += ` AND start_time >= $${params.length}`;
        }

        if (tillDate) {
            params.push(tillDate + ' 23:59:59');
            query += ` AND start_time <= $${params.length}`;
        }

        query += ` ORDER BY start_time DESC`;

        const result = await db.query(query, params);
        res.json({ success: true, records: result.rows });
    } catch (err) {
        console.error('Get Start End report error:', err);
        res.status(500).json({ success: false, message: 'Server error fetching Start End report.' });
    }
});

/**
 * GET /api/client/reports/dsr-summary
 * Get DSR Summary Report data
 */
router.get('/reports/dsr-summary', verifyAuth, async (req, res) => {
    try {
        const { clientId, fromDate, tillDate } = req.query;
        let filterSql = '';
        const params = [];

        if (clientId && clientId !== 'All') {
            params.push(clientId);
            filterSql += ` AND client_id = $${params.length}`;
        }

        if (fromDate) {
            params.push(fromDate + ' 00:00:00');
            filterSql += ` AND created_at >= $${params.length}`;
        }

        if (tillDate) {
            params.push(tillDate + ' 23:59:59');
            filterSql += ` AND created_at <= $${params.length}`;
        }

        const recordsQuery = `
            SELECT 
                customer_name AS client_name, 
                site_name, 
                visited_for, 
                client_name AS assigned_to, 
                COUNT(*) AS no_of_visit
            FROM dsr_updates
            WHERE 1=1
            ${filterSql}
            GROUP BY customer_name, site_name, visited_for, client_name 
            ORDER BY customer_name ASC
        `;

        const statsQuery = `
            SELECT 
                COUNT(*) AS total_visits, 
                COUNT(*) AS total_dsr_updates, 
                COUNT(CASE WHEN followup IS NOT NULL AND followup != '' AND followup != 'null' THEN 1 END) AS total_followups 
            FROM dsr_updates 
            WHERE 1=1
            ${filterSql}
        `;

        const statusQuery = `
            SELECT visited_for, COUNT(*) AS count 
            FROM dsr_updates 
            WHERE 1=1
            ${filterSql}
            GROUP BY visited_for
        `;

        const [recordsRes, statsRes, statusRes] = await Promise.all([
            db.query(recordsQuery, params),
            db.query(statsQuery, params),
            db.query(statusQuery, params)
        ]);

        const stats = statsRes.rows[0] || { total_visits: 0, total_dsr_updates: 0, total_followups: 0 };
        res.json({
            success: true,
            records: recordsRes.rows,
            stats: {
                total_visits: parseInt(stats.total_visits) || 0,
                total_dsr_updates: parseInt(stats.total_dsr_updates) || 0,
                total_followups: parseInt(stats.total_followups) || 0
            },
            statusCounts: statusRes.rows
        });
    } catch (err) {
        console.error('Get DSR summary report error:', err);
        res.status(500).json({ success: false, message: 'Server error fetching DSR summary report.' });
    }
});

/**
 * GET /api/client/reports/dsr-list
 * Get Detailed DSR list report data
 */
router.get('/reports/dsr-list', verifyAuth, async (req, res) => {
    try {
        const { clientId, fromDate, tillDate } = req.query;
        let query = `
            SELECT 
                client_name AS visited_by,
                created_at AS visited_on,
                customer_name AS client,
                office_address,
                site_name,
                contact_person,
                contact_no,
                last_remark,
                visited_for,
                followup
            FROM dsr_updates
            WHERE 1=1
        `;
        const params = [];

        if (clientId && clientId !== 'All') {
            params.push(clientId);
            query += ` AND client_id = $${params.length}`;
        }

        if (fromDate) {
            params.push(fromDate + ' 00:00:00');
            query += ` AND created_at >= $${params.length}`;
        }

        if (tillDate) {
            params.push(tillDate + ' 23:59:59');
            query += ` AND created_at <= $${params.length}`;
        }

        query += ` ORDER BY created_at DESC`;

        const result = await db.query(query, params);
        res.json({ success: true, records: result.rows });
    } catch (err) {
        console.error('Get DSR list report error:', err);
        res.status(500).json({ success: false, message: 'Server error fetching DSR list report.' });
    }
});

module.exports = router;
