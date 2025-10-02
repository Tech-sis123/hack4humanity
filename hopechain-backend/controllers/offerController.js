const Offer = require('../models/Offer');
const User = require('../models/User');

// @desc    Create new offer
// @route   POST /api/offers
// @access  Private
const createOffer = async (req, res) => {
  try {
    const { title, description, resource, location, availability } = req.body;
    
    // Validate required fields
    if (!title || !description || !resource || !location || !availability) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    // Validate availability dates
    if (new Date(availability.startDate) >= new Date(availability.endDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }
    
    // Create offer
    const offer = await Offer.create({
      userId: req.user._id,
      userName: req.user.name,
      title,
      description,
      resource,
      location,
      availability
    });
    
    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: {
        offer
      }
    });
    
  } catch (error) {
    console.error('Create offer error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      return res.status(400).json({
        success: false,
        message: `Validation Error: ${message}`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error creating offer',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all offers
// @route   GET /api/offers
// @access  Public
const getOffers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      resource,
      city,
      state,
      status = 'available',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (resource) {
      filter.resource = new RegExp(resource, 'i');
    }
    
    if (city) {
      filter['location.city'] = new RegExp(city, 'i');
    }
    
    if (state) {
      filter['location.state'] = new RegExp(state, 'i');
    }
    
    if (status) {
      filter.status = status;
    }
    
    filter.isActive = true;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get offers with pagination
    const offers = await Offer.find(filter)
      .populate('userId', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Offer.countDocuments(filter);
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;
    
    res.status(200).json({
      success: true,
      count: offers.length,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRecords: total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      },
      data: {
        offers
      }
    });
    
  } catch (error) {
    console.error('Get offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching offers',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get single offer
// @route   GET /api/offers/:id
// @access  Public
const getOffer = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get offer
    const offer = await Offer.findById(id)
      .populate('userId', 'name email');
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        offer
      }
    });
    
  } catch (error) {
    console.error('Get offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching offer',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Private
const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, resource, location, availability, isActive, status } = req.body;
    
    // Get offer
    let offer = await Offer.findById(id);
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }
    
    // Check if user is owner of offer
    if (offer.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to update this offer'
      });
    }
    
    // Update offer
    const updateData = {};
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (resource) updateData.resource = resource;
    if (location) updateData.location = location;
    if (availability) updateData.availability = availability;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (status) updateData.status = status;
    
    offer = await Offer.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      message: 'Offer updated successfully',
      data: {
        offer
      }
    });
    
  } catch (error) {
    console.error('Update offer error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      return res.status(400).json({
        success: false,
        message: `Validation Error: ${message}`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error updating offer',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private
const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get offer
    const offer = await Offer.findById(id);
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }
    
    // Check if user is owner of offer
    if (offer.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to delete this offer'
      });
    }
    
    // Delete offer
    await Offer.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Offer deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting offer',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get user's offers
// @route   GET /api/offers/user/:userId
// @access  Public
const getUserOffers = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get user's offers with pagination
    const offers = await Offer.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Offer.countDocuments({ userId });
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;
    
    res.status(200).json({
      success: true,
      count: offers.length,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRecords: total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      },
      data: {
        offers
      }
    });
    
  } catch (error) {
    console.error('Get user offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user offers',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createOffer,
  getOffers,
  getOffer,
  updateOffer,
  deleteOffer,
  getUserOffers
};