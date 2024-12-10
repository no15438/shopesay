const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config({ path: '.env' });
console.log('Environment Variables:', process.env);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5001;

// Log environment
console.log(`Running in ${process.env.NODE_ENV || 'development'} mode`);

// Check required environment variables
const requiredEnvVars = ['PORT', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.error(`Missing environment variable: ${varName}`);
        process.exit(1);
    }
});

// Test database connection
db.getConnection((err) => {
    if (err) {
        console.error('Database connection failed:', {
            message: err.message,
            stack: err.stack,
        });
        process.exit(1);
    } else {
        console.log('Database connected successfully');
    }
});

// Middleware setup
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(process.env.NODE_ENV === 'development' ? morgan('dev') : morgan('combined'));

// Default route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running!', version: '1.0.0' });
});

// Routes
try {
    app.use('/api/products', require('./routes/product.routes'));
    app.use('/api/cart', require('./routes/cart.routes'));
    app.use('/api/orders', require('./routes/order.routes'));
    app.use('/api/auth', require('./routes/auth.routes'));
    app.use('/api/admin', require('./routes/admin.routes'));
    app.use('/api/categories', require('./routes/category.routes'));
} catch (error) {
    console.error('Error loading routes:', error.message);
    process.exit(1);
}

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res) => {
    console.error('Global error:', err.stack || err.message);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});