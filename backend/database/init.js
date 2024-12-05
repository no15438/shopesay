const fs = require('fs').promises;
const path = require('path');
const db = require('../config/db');

async function initializeDatabase() {
    try {
        const sqlFile = path.join(__dirname, 'init.sql');
        const sql = await fs.readFile(sqlFile, 'utf8');

        const queries = sql.split(';').filter(query => query.trim());
        
        for (let query of queries) {
            if (query.trim()) {
                try {
                    await db.execute(query);
                    console.log('Successfully executed:', query.substring(0, 50) + '...');
                } catch (error) {
                    console.error('Error executing query:', query);
                    console.error('Error details:', error);
                }
            }
        }

        console.log('Database initialization completed successfully.');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        process.exit();
    }
}

initializeDatabase();