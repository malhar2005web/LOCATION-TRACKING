
const fs = require('fs');
const path = require('path');
const db = require('./config/db');

async function initDb() {
    try {
        console.log(' Initializing PostgreSQL database...');

        const schemaPath = path.join(__dirname, 'models', 'schema.sql');
        if (!fs.existsSync(schemaPath)) {
            throw new Error(`Schema file not found at: ${schemaPath}`);
        }

        const sql = fs.readFileSync(schemaPath, 'utf8');
        
        
        
        
        await db.query(sql);

        console.log(' PostgreSQL database schema initialized successfully!');
        
        
        const res = await db.query(
            `SELECT table_name 
             FROM information_schema.tables 
             WHERE table_schema = 'public' 
             ORDER BY table_name`
        );
        
        console.log('\nExisting tables in database:');
        res.rows.forEach(row => {
            console.log(` - ${row.table_name}`);
        });
        console.log('');
        
        process.exit(0);
    } catch (err) {
        console.error(' Database initialization failed:', err);
        process.exit(1);
    }
}

initDb();
