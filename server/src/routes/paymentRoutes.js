const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/create-intent', paymentController.createPaymentIntent);
router.get('/:orderId/status', paymentController.getPaymentStatus);


module.exports = router;