const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createOffer,
  getOffers,
  getOffer,
  updateOffer,
  deleteOffer,
  getUserOffers
} = require('../controllers/offerController');

const router = express.Router();

router.route('/')
  .post(protect, createOffer)
  .get(getOffers);

router.route('/:id')
  .get(getOffer)
  .put(protect, updateOffer)
  .delete(protect, deleteOffer);

router.route('/user/:userId')
  .get(getUserOffers);

module.exports = router;