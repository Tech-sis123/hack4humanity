const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is not defined');
      console.error('📝 Please check your .env file and ensure MONGODB_URI is set correctly');
      process.exit(1);
    }

    console.log('🔍 Attempting to connect to MongoDB Atlas...');
    console.log('🔗 URI:', process.env.MONGODB_URI.substring(0, 50) + '...');

    // MongoDB Atlas connection options (compatible with latest drivers)
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Maintain a minimum of 5 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };

    // Connect to MongoDB Atlas
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log(`🍃 MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error.message);
    
    // Specific error handling for common Atlas issues
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Check your username and password in MONGODB_URI');
    } else if (error.message.includes('network timeout')) {
      console.error('🌐 Check your network connection and Atlas cluster status');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🔍 Check your Atlas cluster URL in MONGODB_URI');
    }
    
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB Atlas disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB Atlas reconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Atlas error:', err.message);
});

module.exports = connectDB;