const express = require('express');
const { protect } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

router.use(protect);

router.get('/', notificationController.getMyNotifications);
router.get('/unread-count', notificationController.getMyUnreadCount);
router.post('/read-all', notificationController.readAllNotifications);
router.post('/:notificationId/read', notificationController.readNotification);

module.exports = router;