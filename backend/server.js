const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config({ path: '.env' });

// Enhanced logging for environment variables
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

// Database connection with enhanced error handling
db.getConnection((err) => {
  if (err) {
    console.error('Database connection failed:', {
      message: err.message,
      stack: err.stack,
      code: err.code,
      state: err.state
    });
    process.exit(1);
  } else {
    console.log('Database connected successfully');
  }
});

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    /^https:\/\/shopesay-.*-no15438s-projects\.vercel\.app$/
  ];
  
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }
  
  app.use(cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // 检查是否匹配任何允许的域名或正则表达式
      const allowed = allowedOrigins.some(allowed => {
        return typeof allowed === 'string' 
          ? allowed === origin
          : allowed.test(origin);
      });
      
      if (!allowed) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
  }));

// Pre-flight requests
app.options('*', cors());

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(process.env.NODE_ENV === 'development' ? morgan('dev') : morgan('combined'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Request Headers:', req.headers);
  next();
});

// Default route with health check
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Server is running!', 
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes registration with error handling
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

// Enhanced global error handler
app.use((err, req, res) => {
  console.error('Global error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : undefined,
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown handler
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Performing graceful shutdown...');
  db.end(() => {
    console.log('Database connections closed.');
    process.exit(0);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Allowed Origins:`, allowedOrigins);
});