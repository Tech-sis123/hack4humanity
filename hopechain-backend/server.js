const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load env vars explicitly
dotenv.config({ path: './.env' });

// Force clear Node.js require cache to prevent any old module caching
Object.keys(require.cache).forEach(function(key) {
  if (key.indexOf('node_modules') === -1) {
    delete require.cache[key];
  }
});

// Aggressively clear all Mongoose models to prevent discriminator conflicts
const mongoose = require('mongoose');
if (mongoose.connection) {
  mongoose.connection.models = {};
}
if (mongoose.models) {
  Object.keys(mongoose.models).forEach(modelName => {
    delete mongoose.models[modelName];
  });
}
if (mongoose.modelSchemas) {
  Object.keys(mongoose.modelSchemas).forEach(schemaName => {
    delete mongoose.modelSchemas[schemaName];
  });
}

console.log('🚀 Starting HopeChain Backend with fresh cache...');
console.log('🔄 All caches cleared - Node require cache and Mongoose models');

// Connect to database
connectDB();

// Load models
require('./models/User');
require('./models/Offer');
require('./models/Need');
require('./models/Connection');

// Route files
const auth = require('./routes/auth');
const users = require('./routes/donors'); // Using donors.js as main user routes
const connections = require('./routes/connections');
const offers = require('./routes/offers');
const needs = require('./routes/needs');

const app = express();

// CORS middleware with more permissive settings for development
app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? ['http://localhost:5173', 'http://localhost:5000', 'http://localhost:3000'] : process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  exposedHeaders: ['Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log('Headers:', req.headers);
    next();
  });
}

// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/connections', connections);
app.use('/api/offers', offers);
app.use('/api/needs', needs);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HopeChain Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to HopeChain API - Blockchain-based Humanitarian Aid Platform',
    documentation: '/api/docs',
    health: '/api/health',
    version: '1.0.0'
  });
});

// Handle undefined routes (must be last)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 HopeChain Backend Server is running!`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth Endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`👥 User Endpoints: http://localhost:${PORT}/api/users`);
  console.log(`\n📋 Available Routes:`);
  console.log(`   POST /api/auth/register   - Register new user`);
  console.log(`   POST /api/auth/login      - Login user`);
  console.log(`   GET  /api/auth/me         - Get current user (Protected)`);
  console.log(`   GET  /api/users/profile   - Get user profile (Protected)`);
  console.log(`   PUT  /api/users/profile   - Update profile (Protected)`);
  console.log(`   GET  /api/users/list/donors - List all donors (Protected)`);
  console.log(`   GET  /api/connections     - Get user connections (Protected)`);
  console.log(`   POST /api/connections     - Create new connection (Protected)`);
  console.log(`   POST /api/offers          - Create new offer (Protected)`);
  console.log(`   GET  /api/offers          - Get all offers`);
  console.log(`   GET  /api/offers/:id      - Get single offer`);
  console.log(`   PUT  /api/offers/:id      - Update offer (Protected)`);
  console.log(`   DELETE /api/offers/:id    - Delete offer (Protected)`);
  console.log(`   POST /api/needs           - Create new need (Protected)`);
  console.log(`   GET  /api/needs           - Get all needs`);
  console.log(`   GET  /api/needs/:id       - Get single need`);
  console.log(`   PUT  /api/needs/:id       - Update need (Protected)`);
  console.log(`   DELETE /api/needs/:id     - Delete need (Protected)`);
  console.log(`\n💡 Ready to accept connections!\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;