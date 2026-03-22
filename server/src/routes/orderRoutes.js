const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', orderController.createOrder);
router.get('/', orderController.getMyOrders);
router.get('/stats', orderController.getOrderStats);
router.get('/:id', orderController.getOrder);

router.put('/:id/requirements', orderController.submitRequirements);
router.post('/:id/deliver', orderController.deliverOrder);
router.post('/:id/revision', orderController.requestRevision);
router.post('/:id/accept', orderController.acceptDelivery);
router.post('/:id/cancel', orderController.cancelOrder);

module.exports = router;