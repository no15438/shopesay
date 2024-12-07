const fs = require('fs').promises;
const path = require('path');
const db = require('../config/db');

async function initializeDatabase() {
    try {
        // Locate and read the SQL initialization file
        const sqlFile = path.join(__dirname, 'init.sql');
        const sql = await fs.readFile(sqlFile, 'utf8');

        // Split SQL into individual queries, filtering out comments and empty lines
        const queries = sql
            .split(';')
            .map(query => query.trim())
            .filter(query => query && !query.startsWith('--') && !query.startsWith('/*'));

        // Start a transaction
        await db.beginTransaction();

        for (let query of queries) {
            try {
                await db.execute(query); // Execute each query
                console.log('Successfully executed:', query.substring(0, 50) + '...');
            } catch (error) {
                console.error('Error executing query:', query);
                console.error('Error details:', error);
                throw error; // Throw an error to trigger rollback
            }
        }

        // Commit the transaction after successful execution
        await db.commit();
        console.log('Database initialization completed successfully.');
    } catch (error) {
        console.error('Error initializing database:', error);

        // Rollback transaction in case of errors
        try {
            await db.rollback();
        } catch (rollbackError) {
            console.error('Rollback failed:', rollbackError);
        }

        process.exitCode = 1; // Set non-zero exit code for failure
    } finally {
        process.exit();
    }
}

initializeDatabase();