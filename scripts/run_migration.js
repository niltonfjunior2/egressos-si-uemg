const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' }); // Load .env from root

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('DATABASE_URL not found in .env');
    process.exit(1);
}

const client = new Client({
    connectionString: connectionString,
});

async function runMigration() {
    try {
        await client.connect();
        console.log('Connected to database');

        const files = [
            'sql/add_mobile_phone_column.sql',
            'sql/replace_avatar_with_social.sql',
            'sql/add_lattes_url.sql'
        ];

        for (const file of files) {
            const filePath = path.join(__dirname, '..', file);
            if (fs.existsSync(filePath)) {
                const sql = fs.readFileSync(filePath, 'utf8');
                console.log(`Executing ${file}...`);
                await client.query(sql);
                console.log(`Executed ${file}`);
            } else {
                console.error(`File not found: ${filePath}`);
            }
        }

    } catch (err) {
        console.error('Error executing migration:', err);
    } finally {
        await client.end();
    }
}

runMigration();
