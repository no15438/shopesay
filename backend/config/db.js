const mysql = require('mysql2');
require('dotenv').config();

['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'].forEach((key) => {
    if (!process.env[key]) {
        console.error(`Error: ${key} is not set in the environment variables.`);
        process.exit(1);
    }
});

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'shopping_site',
    waitForConnections: true,
    connectionLimit: process.env.DB_CONNECTION_LIMIT || 20,
    queueLimit: process.env.DB_QUEUE_LIMIT || 0,
    timezone: process.env.DB_TIMEZONE || '+08:00',
    charset: 'utf8mb4',
    multipleStatements: true
};

const pool = mysql.createPool(dbConfig);

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
    console.log('Successfully connected to the database.');
    connection.release();
});

pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused.');
    }
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
        console.error('Database access denied. Check DB_USER and DB_PASSWORD.');
    }
});

module.exports = pool.promise();