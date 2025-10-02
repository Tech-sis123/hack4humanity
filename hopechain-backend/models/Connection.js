const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  resource: {
    type: String,
    required: [true, 'Resource is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  // Simple communication
  communication: {
    donorMessage: {
      type: String,
      maxlength: [500, 'Message cannot exceed 500 characters']
    },
    recipientMessage: {
      type: String,
      maxlength: [500, 'Message cannot exceed 500 characters']
    }
  },
  // Simple blockchain integration (MVP)
  blockchain: {
    transactionHash: String,
    verified: {
      type: Boolean,
      default: false
    },
    timestamp: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
connectionSchema.index({ donorId: 1, status: 1 });
connectionSchema.index({ recipientId: 1, status: 1 });
connectionSchema.index({ status: 1, createdAt: -1 });

// Simple methods for MVP
connectionSchema.methods.confirm = function() {
  this.status = 'confirmed';
  return this.save();
};

connectionSchema.methods.complete = function() {
  this.status = 'completed';
  return this.save();
};

connectionSchema.methods.cancel = function() {
  this.status = 'cancelled';
  return this.save();
};

// Static method to find user's connections
connectionSchema.statics.findUserConnections = function(userId) {
  return this.find({
    $or: [
      { donorId: userId },
      { recipientId: userId }
    ]
  })
  .populate('donorId', 'name type bloodType location blockchainDID')
  .populate('recipientId', 'name type bloodType location blockchainDID')
  .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Connection', connectionSchema);