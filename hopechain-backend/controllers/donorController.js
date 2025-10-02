const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    // Get user details directly from User model
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = { ...req.body };
    
    // Remove sensitive fields that shouldn't be updated here
    delete updateData.password;
    delete updateData.type;
    delete updateData._id;
    delete updateData.__v;

    // Update user directly with User model
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    
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
      message: 'Server error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all donors (for testing and admin purposes)
// @route   GET /api/users/donors
// @access  Private (can be public for testing)
const getAllDonors = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      city,
      state,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object for donors
    const filter = { type: 'donor' };
    
    if (city) {
      filter['location.city'] = new RegExp(city, 'i');
    }
    
    if (state) {
      filter['location.state'] = new RegExp(state, 'i');
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get donors with pagination using User model
    const donors = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await User.countDocuments(filter);
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.status(200).json({
      success: true,
      count: donors.length,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRecords: total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      },
      data: {
        donors
      }
    });
    
  } catch (error) {
    console.error('Get all donors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching donors',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all recipients (for testing and admin purposes)
// @route   GET /api/users/recipients
// @access  Private
const getAllRecipients = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      city,
      state,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object for recipients
    const filter = { type: 'recipient' };
    
    if (city) {
      filter['location.city'] = new RegExp(city, 'i');
    }
    
    if (state) {
      filter['location.state'] = new RegExp(state, 'i');
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get recipients with pagination using User model
    const recipients = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await User.countDocuments(filter);
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.status(200).json({
      success: true,
      count: recipients.length,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRecords: total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      },
      data: {
        recipients
      }
    });
    
  } catch (error) {
    console.error('Get all recipients error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching recipients',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get user directly using User model
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
    
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllDonors,
  getAllRecipients,
  getUserById
};