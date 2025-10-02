const mongoose = require('mongoose');

const NeedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  resource: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  urgency: {
    level: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    deadline: {
      type: Date
    }
  },
  isFulfilled: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'fulfilled', 'expired'],
    default: 'open'
  },
  fulfilledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fulfilledAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for location-based queries
NeedSchema.index({ 'location.coordinates': '2dsphere' });

// Index for text search
NeedSchema.index({ title: 'text', description: 'text', resource: 'text' });

// Index for common queries
NeedSchema.index({ userId: 1, isActive: 1 });
NeedSchema.index({ status: 1, isActive: 1 });
NeedSchema.index({ 'urgency.level': 1, status: 1 });
NeedSchema.index({ resource: 1, status: 1 });

module.exports = mongoose.model('Need', NeedSchema);