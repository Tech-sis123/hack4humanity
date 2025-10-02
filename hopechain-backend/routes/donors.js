const express = require('express');
const {
  getProfile,
  updateProfile,
  getAllDonors,
  getAllRecipients,
  getUserById
} = require('../controllers/donorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User profile routes
router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

// List routes (for testing and admin purposes) - must come before :id route
router.get('/list/donors', getAllDonors);
router.get('/list/recipients', getAllRecipients);

// Get specific user by ID - must come after specific routes
router.get('/:id', getUserById);

module.exports = router;