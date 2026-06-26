const db = require('./config/db');

async function run() {
    // Check if arguments are provided: node insert_client_11.js <clientId> <deviceId> <name>
    const args = process.argv.slice(2);

    let clientId = '11';
    let deviceId = '8a08f0e7a1114c63';
    let name = 'demo admin2';

    if (args.length >= 3) {
        clientId = args[0];
        deviceId = args[1];
        name = args[2];
        console.log(`Using provided arguments - Client ID: ${clientId}, Device ID: ${deviceId}, Name: ${name}`);
    } else {
        console.log(`No arguments provided. Seeding default client 11. (Usage for other clients: node insert_client_11.js <clientId> <deviceId> <name>)`);
    }

    try {
        await db.query(`
            INSERT INTO clients (client_id, device_id, name)
            VALUES ($1, $2, $3)
            ON CONFLICT (client_id) 
            DO UPDATE SET device_id = EXCLUDED.device_id, name = EXCLUDED.name
        `, [clientId, deviceId, name]);
        console.log(`✅ Client ${clientId} successfully registered/updated in database with device ID: ${deviceId}`);
        process.exit(0);
    } catch (err) {
        console.error(`❌ Failed to register Client ${clientId}:`, err);
        process.exit(1);
    }
}

run();
