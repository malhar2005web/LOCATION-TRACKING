const db = require('./config/db');

async function run() {
    try {
        // Upsert client '11' with device ID '8a08f0e7a1114c63'
        await db.query(`
            INSERT INTO clients (client_id, device_id, name)
            VALUES ('11', '8a08f0e7a1114c63', 'demo admin2')
            ON CONFLICT (client_id) 
            DO UPDATE SET device_id = EXCLUDED.device_id, name = EXCLUDED.name
        `);
        console.log('✅ Client 11 successfully registered/updated in database with device ID: 8a08f0e7a1114c63');
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed to register Client 11:', err);
        process.exit(1);
    }
}

run();
