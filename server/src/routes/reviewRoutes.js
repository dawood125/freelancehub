const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// Public
router.get('/gig/:gigId', reviewController.getGigReviews);
router.get('/seller/:sellerId', reviewController.getSellerReviews);

// Protected
router.post('/', protect, reviewController.createReview);
router.get('/order/:orderId', protect, reviewController.getOrderReview);
router.post('/:reviewId/response', protect, reviewController.respondToReview);

module.exports = router;