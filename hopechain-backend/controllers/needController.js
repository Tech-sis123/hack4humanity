const Need = require('../models/Need');
const User = require('../models/User');

// @desc    Create new need
// @route   POST /api/needs
// @access  Private
const createNeed = async (req, res) => {
  try {
    const { title, description, resource, location, urgency } = req.body;
    
    // Validate required fields
    if (!title || !description || !resource || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    // Validate urgency deadline if provided
    if (urgency && urgency.deadline) {
      if (new Date(urgency.deadline) < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Deadline must be in the future'
        });
      }
    }
    
    // Create need
    const need = await Need.create({
      userId: req.user._id,
      userName: req.user.name,
      title,
      description,
      resource,
      location,
      urgency: urgency || { level: 'medium' }
    });
    
    res.status(201).json({
      success: true,
      message: 'Need created successfully',
      data: {
        need
      }
    });
    
  } catch (error) {
    console.error('Create need error:', error);
    
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
      message: 'Server error creating need',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all needs
// @route   GET /api/needs
// @access  Public
const getNeeds = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      resource,
      city,
      state,
      status = 'open',
      urgency,
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
    
    if (urgency) {
      filter['urgency.level'] = urgency;
    }
    
    filter.isActive = true;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get needs with pagination
    const needs = await Need.find(filter)
      .populate('userId', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Need.countDocuments(filter);
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;
    
    res.status(200).json({
      success: true,
      count: needs.length,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRecords: total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      },
      data: {
        needs
      }
    });
    
  } catch (error) {
    console.error('Get needs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching needs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get single need
// @route   GET /api/needs/:id
// @access  Public
const getNeed = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get need
    const need = await Need.findById(id)
      .populate('userId', 'name email');
    
    if (!need) {
      return res.status(404).json({
        success: false,
        message: 'Need not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        need
      }
    });
    
  } catch (error) {
    console.error('Get need error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching need',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update need
// @route   PUT /api/needs/:id
// @access  Private
const updateNeed = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, resource, location, urgency, isActive, status, isFulfilled } = req.body;
    
    // Get need
    let need = await Need.findById(id);
    
    if (!need) {
      return res.status(404).json({
        success: false,
        message: 'Need not found'
      });
    }
    
    // Check if user is owner of need
    if (need.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to update this need'
      });
    }
    
    // Update need
    const updateData = {};
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (resource) updateData.resource = resource;
    if (location) updateData.location = location;
    if (urgency) updateData.urgency = urgency;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (status) updateData.status = status;
    if (isFulfilled !== undefined) updateData.isFulfilled = isFulfilled;
    
    need = await Need.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      message: 'Need updated successfully',
      data: {
        need
      }
    });
    
  } catch (error) {
    console.error('Update need error:', error);
    
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
      message: 'Server error updating need',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete need
// @route   DELETE /api/needs/:id
// @access  Private
const deleteNeed = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get need
    const need = await Need.findById(id);
    
    if (!need) {
      return res.status(404).json({
        success: false,
        message: 'Need not found'
      });
    }
    
    // Check if user is owner of need
    if (need.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to delete this need'
      });
    }
    
    // Delete need
    await Need.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Need deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete need error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting need',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get user's needs
// @route   GET /api/needs/user/:userId
// @access  Public
const getUserNeeds = async (req, res) => {
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
    
    // Get user's needs with pagination
    const needs = await Need.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Need.countDocuments({ userId });
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;
    
    res.status(200).json({
      success: true,
      count: needs.length,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRecords: total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      },
      data: {
        needs
      }
    });
    
  } catch (error) {
    console.error('Get user needs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user needs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createNeed,
  getNeeds,
  getNeed,
  updateNeed,
  deleteNeed,
  getUserNeeds
};