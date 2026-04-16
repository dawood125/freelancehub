const catchAsync = require('../utils/catchAsync');
const {
  createOrGetConversationForOrder,
  listConversationsForUser,
  getConversationMessages,
  sendMessage,
  markConversationRead
} = require('../services/messageService');
const { getIO } = require('../sockets/socketServer');

const getOrCreateConversation = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  const { conversation, isNew, unreadCount } = await createOrGetConversationForOrder({
    orderId,
    userId: req.user._id
  });

  res.status(isNew ? 201 : 200).json({
    success: true,
    message: isNew ? 'Conversation created.' : 'Conversation already exists.',
    data: {
      conversation,
      unreadCount,
      isNew
    }
  });
});

const getMyConversations = catchAsync(async (req, res) => {
  const conversations = await listConversationsForUser(req.user._id);

  res.status(200).json({
    success: true,
    count: conversations.length,
    data: { conversations }
  });
});

const getMessages = catchAsync(async (req, res) => {
  const { conversationId } = req.params;
  const { before, limit } = req.query;

  const result = await getConversationMessages({
    conversationId,
    userId: req.user._id,
    before,
    limit
  });

  res.status(200).json({
    success: true,
    data: result
  });
});

const createMessage = catchAsync(async (req, res) => {
  const { conversationId } = req.params;
  const { content } = req.body;

  const result = await sendMessage({
    conversationId,
    senderId: req.user._id,
    content
  });

  const io = getIO();
  if (io) {
    io.to(`conversation:${conversationId}`).emit('message:new', {
      conversationId,
      message: result.message
    });
  }

  res.status(201).json({
    success: true,
    message: 'Message sent.',
    data: {
      message: result.message
    }
  });
});

const readConversation = catchAsync(async (req, res) => {
  const { conversationId } = req.params;

  const result = await markConversationRead({
    conversationId,
    userId: req.user._id
  });

  res.status(200).json({
    success: true,
    message: 'Conversation marked as read.',
    data: {
      conversationId,
      unreadCount: result.unreadCount
    }
  });
});

module.exports = {
  getOrCreateConversation,
  getMyConversations,
  getMessages,
  createMessage,
  readConversation
};
