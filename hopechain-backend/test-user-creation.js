/**
 * Test User Creation - Check if discriminator issue is resolved
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Clear all models before loading
if (mongoose.connection) {
  mongoose.connection.models = {};
}
if (mongoose.models) {
  Object.keys(mongoose.models).forEach(modelName => {
    delete mongoose.models[modelName];
  });
}

const connectDB = require('./config/database');

const testUserCreation = async () => {
  console.log('🧪 Testing User Creation (No Discriminators)...\n');
  
  try {
    // Connect to database
    await connectDB();
    
    // Load User model AFTER clearing cache
    const User = require('./models/User');
    
    console.log('✅ User model loaded successfully');
    console.log('📋 User model info:', {
      modelName: User.modelName,
      collection: User.collection.name,
      discriminators: User.discriminators || 'None'
    });
    
    // Test user creation
    const testUserData = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'password123',
      type: 'donor',
      bloodType: 'O+',
      location: 'Test Address, Test City'
    };
    
    console.log('\n🔄 Creating test user...');
    const user = await User.create(testUserData);
    
    console.log('✅ User created successfully!');
    console.log('📊 User details:', {
      id: user._id,
      name: user.name,
      email: user.email,
      type: user.type,
      bloodType: user.bloodType,
      location: user.location
    });
    
    // Clean up test user
    await User.findByIdAndDelete(user._id);
    console.log('🧹 Test user cleaned up');
    
    console.log('\n🎉 USER CREATION TEST PASSED!');
    console.log('✅ No discriminator errors detected');
    
  } catch (error) {
    console.error('\n❌ USER CREATION TEST FAILED!');
    console.error('Error:', error.message);
    
    if (error.message.includes('discriminator')) {
      console.error('\n🚨 DISCRIMINATOR ERROR DETECTED!');
      console.error('This indicates Mongoose still has cached discriminator models');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
    process.exit(0);
  }
};

// Run the test
testUserCreation();