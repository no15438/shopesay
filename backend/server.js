const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config({ path: '.env' });

console.log('Environment Variables loaded');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

const db = require('./config/db');
const app = express();
const PORT = process.env.PORT || 5001;

// Environment validation
const requiredEnvVars = ['PORT', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Missing environment variable: ${varName}`);
    process.exit(1);
  }
});

// Database connection
db.getConnection((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Database connected successfully');
});

// Simplified CORS configuration
app.use(cors({
  origin: true,  // Allow all origins
  credentials: true
}));

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// CORS headers middleware
app.use((req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle OPTIONS method
  if (req.method === 'OPTIONS') {
    return res.status(200).json({
      body: "OK"
    });
  }
  
  next();
});

// Request logging
app.use((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Server is running!', 
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
const routes = [
  { path: '/api/products', router: './routes/product.routes' },
  { path: '/api/cart', router: './routes/cart.routes' },
  { path: '/api/orders', router: './routes/order.routes' },
  { path: '/api/auth', router: './routes/auth.routes' },
  { path: '/api/admin', router: './routes/admin.routes' },
  { path: '/api/categories', router: './routes/category.routes' }
];

routes.forEach(({ path, router }) => {
  try {
    app.use(path, require(router));
  } catch (error) {
    console.error(`Error loading route ${path}:`, error.message);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error handler
app.use((err, req, res) => {
  console.error('Global error:', err);
  
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down...');
  db.end(() => {
    console.log('Database connections closed.');
    process.exit(0);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});