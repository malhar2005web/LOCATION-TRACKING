
require('dotenv').config();
const db = require('./config/db');
const { hashPassword } = require('./utils/helpers');

async function seed() {
    try {
        console.log(' Seeding database...\n');

        const hashedPassword = await hashPassword('admin123');

        await db.query(
            `INSERT INTO admins (admin_id, password, name) 
             VALUES ($1, $2, $3)
             ON CONFLICT (admin_id) DO UPDATE SET password = $2, name = $3`,
            ['admin', hashedPassword, 'Super Admin']
        );

        console.log(' Default admin created:');
        console.log('   Admin ID : admin');
        console.log('   Password : admin123');
        console.log('');

        await db.query(
            `INSERT INTO clients (client_id, device_id, name) 
             VALUES ($1, $2, $3)
             ON CONFLICT (client_id) DO NOTHING`,
            ['CLT-TEST01', 'test-device-001', 'Test Client']
        );

        console.log(' Test client created:');
        console.log('   Client ID : CLT-TEST01');
        console.log('   Device ID : test-device-001');
        console.log('');

        console.log(' Seeding complete!\n');
        process.exit(0);

    } catch (err) {
        console.error(' Seeding error:', err.message);
        process.exit(1);
    }
}

seed();
