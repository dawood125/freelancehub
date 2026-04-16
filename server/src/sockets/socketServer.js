const { Server } = require('socket.io');
const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');
const {
  assertConversationParticipant,
  sendMessage,
  markConversationRead
} = require('../services/messageService');

let ioInstance = null;

const getTokenFromHandshake = (socket) => {
  const authToken = socket.handshake?.auth?.token;
  if (authToken) return authToken;

  const authHeader = socket.handshake?.headers?.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return null;
};

const initSocket = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  ioInstance.use(async (socket, next) => {
    try {
      const token = getTokenFromHandshake(socket);
      if (!token) {
        return next(new Error('Unauthorized: missing token'));
      }

      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('_id name username status avatar');

      if (!user || user.status !== 'active') {
        return next(new Error('Unauthorized: invalid user'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Unauthorized'));
    }
  });

  ioInstance.on('connection', (socket) => {
    const userId = socket.user._id.toString();

    socket.join(`user:${userId}`);

    socket.on('conversation:join', async (payload = {}) => {
      try {
        const { conversationId } = payload;
        if (!conversationId) return;

        await assertConversationParticipant(conversationId, userId);
        socket.join(`conversation:${conversationId}`);

        socket.emit('conversation:joined', { conversationId });
      } catch (error) {
        socket.emit('socket:error', {
          event: 'conversation:join',
          message: error.message || 'Unable to join conversation'
        });
      }
    });

    socket.on('message:send', async (payload = {}) => {
      try {
        const { conversationId, content } = payload;
        if (!conversationId) return;

        const result = await sendMessage({
          conversationId,
          senderId: userId,
          content
        });

        ioInstance.to(`conversation:${conversationId}`).emit('message:new', {
          conversationId,
          message: result.message
        });
      } catch (error) {
        socket.emit('socket:error', {
          event: 'message:send',
          message: error.message || 'Unable to send message'
        });
      }
    });

    socket.on('conversation:read', async (payload = {}) => {
      try {
        const { conversationId } = payload;
        if (!conversationId) return;

        await markConversationRead({ conversationId, userId });

        ioInstance.to(`conversation:${conversationId}`).emit('conversation:read', {
          conversationId,
          userId
        });
      } catch (error) {
        socket.emit('socket:error', {
          event: 'conversation:read',
          message: error.message || 'Unable to mark conversation as read'
        });
      }
    });
  });

  return ioInstance;
};

const getIO = () => ioInstance;

module.exports = {
  initSocket,
  getIO
};
