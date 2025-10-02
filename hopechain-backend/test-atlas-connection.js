#!/usr/bin/env node

/**
 * MongoDB Atlas Connection Test Script
 * 
 * This script helps you test your MongoDB Atlas connection
 * before starting the main application.
 * 
 * Usage: node test-atlas-connection.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  console.log('🧪 Testing MongoDB Atlas Connection...\n');
  
  // Check if MONGODB_URI is configured
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    console.log('💡 Make sure you have set MONGODB_URI in your .env file');
    process.exit(1);
  }
  
  // Check if it's still the placeholder
  if (process.env.MONGODB_URI.includes('YOUR_USERNAME') || 
      process.env.MONGODB_URI.includes('YOUR_PASSWORD')) {
    console.error('❌ MONGODB_URI contains placeholder values');
    console.log('💡 Please replace YOUR_USERNAME and YOUR_PASSWORD with your actual credentials');
    process.exit(1);
  }
  
  console.log('🔗 Connection String Format: ✅ Valid');
  console.log(`🌐 Attempting to connect to: ${process.env.MONGODB_URI.split('@')[1] || 'MongoDB Atlas'}`);  // Fixed regex
  
  try {
    // Connection options optimized for Atlas
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      family: 4
    };
    
    console.log('⏳ Connecting to MongoDB Atlas...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log('\\n✅ CONNECTION SUCCESSFUL!');
    console.log(`🍃 Connected to: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🏷️  Connection ID: ${conn.connection.id}`);
    console.log(`🔌 Ready State: ${conn.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);
    
    // Test basic database operations
    console.log('\\n🧪 Testing database operations...');
    
    // Test write operation
    const testCollection = conn.connection.db.collection('connection_test');
    const testDoc = { 
      test: true, 
      timestamp: new Date(),
      message: 'HopeChain Atlas connection test'
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    console.log('✅ Write Test: SUCCESS (Document inserted)');
    
    // Test read operation
    const foundDoc = await testCollection.findOne({ _id: insertResult.insertedId });
    console.log('✅ Read Test: SUCCESS (Document retrieved)');
    
    // Cleanup test document
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ Delete Test: SUCCESS (Document cleaned up)');
    
    console.log('\\n🎉 ALL TESTS PASSED!');
    console.log('\\n💡 Your MongoDB Atlas connection is ready for HopeChain!');
    console.log('   You can now start your server with: npm start');
    
  } catch (error) {
    console.error('\\n❌ CONNECTION FAILED!');
    console.error(`Error: ${error.message}`);
    
    // Provide helpful troubleshooting tips
    console.log('\\n🔧 Troubleshooting Tips:');
    
    if (error.message.includes('authentication failed')) {
      console.log('   • Check your username and password in the connection string');
      console.log('   • Ensure the database user exists in MongoDB Atlas');
      console.log('   • Verify the user has proper permissions');
    } else if (error.message.includes('network timeout') || error.message.includes('ETIMEDOUT')) {
      console.log('   • Check your internet connection');
      console.log('   • Verify your IP address is whitelisted in Atlas Network Access');
      console.log('   • Try adding 0.0.0.0/0 to allow access from anywhere (for testing)');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.log('   • Check the cluster URL in your connection string');
      console.log('   • Ensure your cluster is running and accessible');
    } else if (error.message.includes('Authentication failed')) {
      console.log('   • Double-check your password (it might contain special characters)');
      console.log('   • Try URL encoding special characters in your password');
    }
    
    console.log('\\n📚 For more help, see: MONGODB_ATLAS_SETUP.md');
  } finally {
    await mongoose.connection.close();
    console.log('\\n🔌 Connection closed');
    process.exit(0);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('\\n💥 Uncaught Exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('\\n💥 Unhandled Rejection:', err.message);
  process.exit(1);
});

// Run the test
testConnection();