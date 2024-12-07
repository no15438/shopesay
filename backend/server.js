const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Parse incoming JSON requests
app.use(morgan('dev')); // Log HTTP requests in development mode

// Test route to verify server is running
app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Product routes
const productRoutes = require('./routes/product.routes');
app.use('/api/products', productRoutes); // All product-related routes

// Cart routes
const cartRoutes = require('./routes/cart.routes');
app.use('/api/cart', cartRoutes); // All cart-related routes

// Order routes
const orderRoutes = require('./routes/order.routes');
app.use('/api/orders', orderRoutes); // All order-related routes

// Auth routes (login and register)
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes); // All auth-related routes

// Admin routes
const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes); // All admin-related routes

// 404 route to handle undefined endpoints
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).json({ message: 'Something broke!' }); // Return a generic 500 error message
});

// Start the server
const PORT = process.env.PORT || 5001; // Use PORT from .env or default to 5001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});