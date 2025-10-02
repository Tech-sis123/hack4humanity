const User = require('../models/User');
const { registerUserOnChain } = require('../utils/blockchain');
const { sendTokenResponse, getSignedJwtToken } = require('../middleware/auth');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    console.log('📥 Registration request received - SERVER UPDATED!');
    console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
    console.log('📋 Request headers:', req.headers['content-type']);
    
    const { name, email, password, type, bloodType, location, needs, skills } = req.body;
    
    console.log('🔍 Extracted fields:', { 
      name: name ? `'${name}'` : 'MISSING', 
      email: email ? `'${email}'` : 'MISSING', 
      password: password ? '***PROVIDED***' : 'MISSING', 
      type: type ? `'${type}'` : 'MISSING', 
      bloodType: bloodType || 'not provided',
      location: location || 'not provided',
      needs: needs || 'not provided',
      skills: skills || 'not provided'
    });

    // Validate required fields with detailed logging
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!type) missingFields.push('type');
    
    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        requiredFields: ['name', 'email', 'password', 'type'],
        receivedFields: Object.keys(req.body),
        missingFields
      });
    }
    
    console.log('✅ All required fields provided - proceeding with registration');

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Validate type instead of role
    const validTypes = ['donor', 'recipient'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type specified. Must be donor or recipient'
      });
    }

    // Create user with simplified data structure
    const userData = {
      name,
      email,
      password,
      type,
      bloodType: bloodType || null,
      location: location || 'Not specified'
    };

    // Create the user
    const user = await User.create(userData);

    // 🟢 ADD BLOCKCHAIN INTEGRATION
    const blockchainInfo = await registerUserOnChain(user._id, user.type);
    user.blockchainDID = blockchainInfo.userDID;
    user.blockchainTxHash = blockchainInfo.txHash;
    
    await user.save();

    // Generate token and send response with blockchain info
    const token = getSignedJwtToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
        bloodType: user.bloodType,
        location: user.location,
        blockchainDID: user.blockchainDID
      },
      blockchain: blockchainInfo // Show simulated blockchain data
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific mongoose errors
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      return res.status(400).json({
        success: false,
        message: `Validation Error: ${message}`
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const message = `${field} already exists`;
      return res.status(400).json({
        success: false,
        message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user account is active (if field exists)
    if (user.isActive !== undefined && !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    sendTokenResponse(user, 200, res, 'Login successful');

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // User is already available from protect middleware
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          type: user.type,
          bloodType: user.bloodType,
          location: user.location,
          blockchainDID: user.blockchainDID
        }
      }
    });

  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'User logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password'
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password updated successfully');

  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating password',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  updatePassword
};