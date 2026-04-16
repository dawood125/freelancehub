const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Order = require('../models/Order');
const AppError = require('../utils/AppError');

const normalizeContent = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ');
};

const getUnreadCountForUser = (unreadCounts, userId) => {
  if (!unreadCounts) return 0;
  const userKey = userId.toString();

  if (unreadCounts instanceof Map) {
    return unreadCounts.get(userKey) || 0;
  }

  return unreadCounts[userKey] || 0;
};

const assertConversationParticipant = async (conversationId, userId) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  const userIdStr = userId.toString();
  const isParticipant = conversation.participants
    .some((participantId) => participantId.toString() === userIdStr);

  if (!isParticipant) {
    throw new AppError('You do not have access to this conversation', 403);
  }

  return conversation;
};

const createOrGetConversationForOrder = async ({ orderId, userId }) => {
  const order = await Order.findById(orderId).select('buyer seller');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const userIdStr = userId.toString();
  const isParticipant =
    order.buyer.toString() === userIdStr || order.seller.toString() === userIdStr;

  if (!isParticipant) {
    throw new AppError('You do not have access to this order conversation', 403);
  }

  let conversation = await Conversation.findOne({ order: orderId })
    .populate('participants', 'name username avatar')
    .populate('lastMessage.sender', 'name username avatar');

  if (conversation) {
    return {
      conversation,
      isNew: false,
      unreadCount: getUnreadCountForUser(conversation.unreadCounts, userId)
    };
  }

  conversation = await Conversation.create({
    order: orderId,
    participants: [order.buyer, order.seller],
    unreadCounts: {
      [order.buyer.toString()]: 0,
      [order.seller.toString()]: 0
    },
    lastMessageAt: new Date()
  });

  const populatedConversation = await Conversation.findById(conversation._id)
    .populate('participants', 'name username avatar')
    .populate('lastMessage.sender', 'name username avatar');

  return {
    conversation: populatedConversation,
    isNew: true,
    unreadCount: 0
  };
};

const listConversationsForUser = async (userId) => {
  const conversations = await Conversation.find({ participants: userId })
    .populate('participants', 'name username avatar')
    .populate('lastMessage.sender', 'name username avatar')
    .sort({ lastMessageAt: -1, updatedAt: -1 });

  return conversations.map((conversation) => ({
    conversation,
    unreadCount: getUnreadCountForUser(conversation.unreadCounts, userId)
  }));
};

const getConversationMessages = async ({ conversationId, userId, before, limit = 30 }) => {
  await assertConversationParticipant(conversationId, userId);

  const parsedLimit = Math.max(1, Math.min(parseInt(limit, 10) || 30, 100));

  const query = { conversation: conversationId };
  if (before) {
    const beforeDate = new Date(before);
    if (Number.isNaN(beforeDate.getTime())) {
      throw new AppError('Invalid before cursor. Use a valid ISO date.', 400);
    }
    query.createdAt = { $lt: beforeDate };
  }

  const messagesDesc = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(parsedLimit)
    .populate('sender', 'name username avatar');

  const nextCursor = messagesDesc.length === parsedLimit
    ? messagesDesc[messagesDesc.length - 1].createdAt.toISOString()
    : null;

  return {
    messages: messagesDesc.reverse(),
    nextCursor,
    count: messagesDesc.length
  };
};

const sendMessage = async ({ conversationId, senderId, content }) => {
  const normalizedContent = normalizeContent(content);
  if (!normalizedContent) {
    throw new AppError('Message content is required', 400);
  }

  const conversation = await assertConversationParticipant(conversationId, senderId);

  const message = await Message.create({
    conversation: conversation._id,
    sender: senderId,
    content: normalizedContent,
    readBy: [{ user: senderId, readAt: new Date() }]
  });

  const senderIdStr = senderId.toString();
  const unreadCounts = conversation.unreadCounts || new Map();

  conversation.participants.forEach((participantId) => {
    const key = participantId.toString();
    if (key === senderIdStr) {
      unreadCounts.set(key, 0);
      return;
    }

    const previous = unreadCounts.get(key) || 0;
    unreadCounts.set(key, previous + 1);
  });

  conversation.unreadCounts = unreadCounts;
  conversation.lastMessage = {
    text: normalizedContent,
    sender: senderId,
    createdAt: message.createdAt
  };
  conversation.lastMessageAt = message.createdAt;
  conversation.totalMessages = (conversation.totalMessages || 0) + 1;

  await conversation.save();

  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'name username avatar');

  return {
    conversation,
    message: populatedMessage
  };
};

const markConversationRead = async ({ conversationId, userId }) => {
  const conversation = await assertConversationParticipant(conversationId, userId);

  await Message.updateMany(
    {
      conversation: conversationId,
      sender: { $ne: userId },
      'readBy.user': { $ne: userId }
    },
    {
      $push: {
        readBy: {
          user: userId,
          readAt: new Date()
        }
      }
    }
  );

  if (!conversation.unreadCounts) {
    conversation.unreadCounts = new Map();
  }
  conversation.unreadCounts.set(userId.toString(), 0);
  await conversation.save();

  return {
    conversation,
    unreadCount: 0
  };
};

module.exports = {
  assertConversationParticipant,
  createOrGetConversationForOrder,
  listConversationsForUser,
  getConversationMessages,
  sendMessage,
  markConversationRead,
  getUnreadCountForUser
};
