const express = require('express');
const { protect } = require('../middleware/auth');
const messageController = require('../controllers/messageController');

const router = express.Router();

router.use(protect);

router.post('/orders/:orderId/conversation', messageController.getOrCreateConversation);
router.get('/conversations', messageController.getMyConversations);
router.get('/conversations/:conversationId/messages', messageController.getMessages);
router.post('/conversations/:conversationId/messages', messageController.createMessage);
router.post('/conversations/:conversationId/read', messageController.readConversation);

module.exports = router;
