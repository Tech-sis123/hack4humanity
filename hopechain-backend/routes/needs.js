const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createNeed,
  getNeeds,
  getNeed,
  updateNeed,
  deleteNeed,
  getUserNeeds
} = require('../controllers/needController');

const router = express.Router();

router.route('/')
  .post(protect, createNeed)
  .get(getNeeds);

router.route('/:id')
  .get(getNeed)
  .put(protect, updateNeed)
  .delete(protect, deleteNeed);

router.route('/user/:userId')
  .get(getUserNeeds);

module.exports = router;