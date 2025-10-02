const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
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
  availability: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['available', 'claimed', 'completed', 'expired'],
    default: 'available'
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  claimedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for location-based queries
OfferSchema.index({ 'location.coordinates': '2dsphere' });

// Index for text search
OfferSchema.index({ title: 'text', description: 'text', resource: 'text' });

// Index for common queries
OfferSchema.index({ userId: 1, isActive: 1 });
OfferSchema.index({ status: 1, isActive: 1 });
OfferSchema.index({ resource: 1, status: 1 });

module.exports = mongoose.model('Offer', OfferSchema);