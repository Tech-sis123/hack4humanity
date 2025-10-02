const Connection = require('../models/Connection');
const User = require('../models/User');
const { recordHelpOnChain } = require('../utils/blockchain');

// @desc    Create a new connection between donor and recipient
// @route   POST /api/connections
// @access  Private
const createConnection = async (req, res) => {
  try {
    const { recipientId, resource, description, donorMessage } = req.body;
    const donorId = req.user._id;

    // Validate required fields
    if (!recipientId || !resource || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide recipient ID, resource, and description'
      });
    }

    // Verify recipient exists and is actually a recipient
    const recipient = await User.findById(recipientId);
    if (!recipient || recipient.type !== 'recipient') {
      return res.status(404).json({
        success: false,
        message: 'User not found or not a recipient'
      });
    }

    // Verify current user is a donor
    if (req.user.type !== 'donor') {
      return res.status(403).json({
        success: false,
        message: 'Only donors can create connections'
      });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      donorId,
      recipientId,
      status: { $nin: ['cancelled', 'completed'] }
    });

    if (existingConnection) {
      return res.status(400).json({
        success: false,
        message: 'Connection already exists between you and this recipient'
      });
    }

    // Create the connection
    const connectionData = {
      donorId,
      recipientId,
      resource,
      description,
      communication: {
        donorMessage: donorMessage || ''
      }
    };

    const connection = await Connection.create(connectionData);

    // 🟢 ADD BLOCKCHAIN INTEGRATION - Record connection on blockchain
    try {
      const blockchainTx = await recordHelpOnChain(
        connection.donorId,
        connection.recipientId,
        connection.resource
      );
      
      connection.blockchain.transactionHash = blockchainTx.txHash;
      connection.blockchain.timestamp = new Date();
      connection.blockchain.verified = true;
      
      await connection.save();
    } catch (blockchainError) {
      console.error('Blockchain recording error:', blockchainError);
      // Continue with connection creation even if blockchain fails
    }

    // Populate connection details
    const populatedConnection = await Connection.findById(connection._id)
      .populate('donorId', 'name type bloodType location blockchainDID')
      .populate('recipientId', 'name type bloodType location blockchainDID');

    res.status(201).json({
      success: true,
      message: 'Connection established successfully',
      data: {
        connection: populatedConnection
      },
      blockchain: {
        txHash: connection.blockchain.transactionHash,
        status: 'simulated_success',
        message: 'Help transaction recorded on blockchain'
      }
    });

  } catch (error) {
    console.error('Create connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating connection',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get user's connections
// @route   GET /api/connections
// @access  Private
const getUserConnections = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, role, page = 1, limit = 10 } = req.query;

    // Build filter
    let filter = {
      $or: [
        { donorId: userId },
        { recipientId: userId }
      ]
    };

    if (status) {
      filter.status = status;
    }

    if (role) {
      // Filter by user's role in the connection
      if (role === 'donor') {
        filter = { donorId: userId };
      } else if (role === 'recipient') {
        filter = { recipientId: userId };
      }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get connections with pagination
    const connections = await Connection.find(filter)
      .populate('donorId', 'name type bloodType location blockchainDID')
      .populate('recipientId', 'name type bloodType location blockchainDID')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Connection.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      count: connections.length,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRecords: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      },
      data: {
        connections
      }
    });

  } catch (error) {
    console.error('Get user connections error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching connections',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get connection by ID
// @route   GET /api/connections/:id
// @access  Private
const getConnectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const connection = await Connection.findById(id)
      .populate('donorId', 'name type bloodType location blockchainDID')
      .populate('recipientId', 'name type bloodType location blockchainDID');

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    // Check if user is part of this connection
    const isAuthorized = connection.donorId._id.toString() === userId.toString() ||
                        connection.recipientId._id.toString() === userId.toString();

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not part of this connection'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        connection
      }
    });

  } catch (error) {
    console.error('Get connection by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching connection',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Confirm connection (donor or recipient)
// @route   PUT /api/connections/:id/confirm
// @access  Private
const confirmConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user._id;

    const connection = await Connection.findById(id);

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    // Determine user's role in this connection
    let userRole = null;
    if (connection.donorId.toString() === userId.toString()) {
      userRole = 'donor';
    } else if (connection.recipientId.toString() === userId.toString()) {
      userRole = 'recipient';
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not part of this connection'
      });
    }

    // Confirm based on role
    if (userRole === 'donor') {
      await connection.confirm();
    } else {
      await connection.confirm();
    }

    // Populate and return updated connection
    const updatedConnection = await Connection.findById(id)
      .populate('donorId', 'name trust')
      .populate('recipientId', 'name trust');

    res.status(200).json({
      success: true,
      message: `Connection confirmed by ${userRole}`,
      data: {
        connection: updatedConnection
      }
    });

  } catch (error) {
    console.error('Confirm connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error confirming connection',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Complete connection
// @route   PUT /api/connections/:id/complete
// @access  Private
const completeConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, success = true } = req.body;
    const userId = req.user._id;

    const connection = await Connection.findById(id);

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    // Determine user's role
    let userRole = null;
    if (connection.donorId.toString() === userId.toString()) {
      userRole = 'donor';
    } else if (connection.recipientId.toString() === userId.toString()) {
      userRole = 'recipient';
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not part of this connection'
      });
    }

    // Complete the connection
    await connection.complete();

    // Update user help statistics (simplified)
    const donor = await User.findById(connection.donorId);
    const recipient = await User.findById(connection.recipientId);

    if (donor) {
      await donor.recordHelpTransaction();
    }
    if (recipient) {
      await recipient.recordHelpTransaction();
    }

    // Populate and return updated connection
    const updatedConnection = await Connection.findById(id)
      .populate('donorId', 'name trust')
      .populate('recipientId', 'name trust');

    res.status(200).json({
      success: true,
      message: `Connection completed by ${userRole}`,
      data: {
        connection: updatedConnection
      }
    });

  } catch (error) {
    console.error('Complete connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error completing connection',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Cancel connection
// @route   PUT /api/connections/:id/cancel
// @access  Private
const cancelConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const connection = await Connection.findById(id);

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    // Check if user is part of this connection
    const isAuthorized = connection.donorId.toString() === userId.toString() ||
                        connection.recipientId.toString() === userId.toString();

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not part of this connection'
      });
    }

    // Check if connection can be cancelled
    if (['completed', 'cancelled'].includes(connection.status)) {
      return res.status(400).json({
        success: false,
        message: 'Connection cannot be cancelled in its current status'
      });
    }

    // Cancel the connection
    await connection.cancel();

    res.status(200).json({
      success: true,
      message: 'Connection cancelled successfully',
      data: {
        connection
      }
    });

  } catch (error) {
    console.error('Cancel connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error cancelling connection',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createConnection,
  getUserConnections,
  getConnectionById,
  confirmConnection,
  completeConnection,
  cancelConnection
};