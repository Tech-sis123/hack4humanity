const express = require('express');
const {
  register,
  login,
  getMe,
  logout,
  updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;