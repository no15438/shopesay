const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config(); // Load environment variables from .env file
const db = require('./config/db'); // Import database configuration

const app = express();

// Log the environment when the server starts
console.log(`Running in ${process.env.NODE_ENV || 'development'} mode`);

// Check for required environment variables
const requiredEnvVars = ['PORT', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.error(`Missing environment variable: ${varName}`);
        process.exit(1); // Exit the application if any variable is missing
    }
});

// Test database connection
db.getConnection((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1); // Exit the application if database connection fails
    } else {
        console.log('Database connected successfully');
    }
});

// Middleware setup
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow requests from the frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    })
);
app.use(express.json()); // Parse incoming JSON requests
app.use(morgan('dev')); // Log HTTP requests in development mode

// Test route to ensure server is running
app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Routes configuration with logging
try {
    console.log('Loading product routes...');
    app.use('/api/products', require('./routes/product.routes')); // Product-related routes
    console.log('/api/products route loaded successfully');

    console.log('Loading cart routes...');
    app.use('/api/cart', require('./routes/cart.routes')); // Cart-related routes

    console.log('Loading order routes...');
    app.use('/api/orders', require('./routes/order.routes')); // Order-related routes

    console.log('Loading authentication routes...');
    app.use('/api/auth', require('./routes/auth.routes')); // Authentication routes

    console.log('Loading admin routes...');
    app.use('/api/admin', require('./routes/admin.routes')); // Admin-related routes

    console.log('Loading category routes...');
    app.use('/api/categories', require('./routes/category.routes')); // Categories-related routes
} catch (error) {
    console.error('Error while loading routes:', error.message);
    process.exit(1); // Exit the application if routes cannot be loaded
}

// 404 handler for undefined endpoints
app.use((req, res, next) => {
    console.log(`404 error - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        message: 'Route not found', // Error message for undefined routes
        method: req.method, // HTTP method of the request
        endpoint: req.originalUrl, // The endpoint the client tried to access
    });
});

// Global error-handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler triggered:', err.stack || err.message); // Log the full error stack or error message
    res.status(500).json({
        message: 'Internal server error', // Generic error response
        error: process.env.NODE_ENV === 'development' ? err.message : undefined, // Include error details in development
    });
});

// Start the server
const PORT = process.env.PORT || 5001; // Use PORT from .env or fallback to 5001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Log the server's port
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`); // Log the environment (development/production)
    console.log(`API base URL: http://localhost:${PORT}`); // Log the base URL for APIs
});