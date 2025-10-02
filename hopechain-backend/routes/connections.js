const express = require('express');
const {
  createConnection,
  getUserConnections,
  getConnectionById,
  confirmConnection,
  completeConnection,
  cancelConnection
} = require('../controllers/connectionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Connection CRUD routes
router.route('/')
  .get(getUserConnections)
  .post(createConnection);

router.route('/:id')
  .get(getConnectionById);

// Connection action routes
router.put('/:id/confirm', confirmConnection);
router.put('/:id/complete', completeConnection);
router.put('/:id/cancel', cancelConnection);

module.exports = router;