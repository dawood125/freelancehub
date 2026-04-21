const AppError = require('../src/utils/AppError');

jest.mock('../src/services/messageService', () => ({
  createOrGetConversationForOrder: jest.fn(),
  listConversationsForUser: jest.fn(),
  getConversationMessages: jest.fn(),
  sendMessage: jest.fn(),
  markConversationRead: jest.fn()
}));

jest.mock('../src/sockets/socketServer', () => ({
  getIO: jest.fn()
}));

const {
  createOrGetConversationForOrder,
  listConversationsForUser,
  getConversationMessages,
  sendMessage,
  markConversationRead
} = require('../src/services/messageService');

const { getIO } = require('../src/sockets/socketServer');

const {
  getOrCreateConversation,
  getMyConversations,
  getMessages,
  createMessage,
  readConversation
} = require('../src/controllers/messageController');

const runHandler = (handler, req) => {
  return new Promise((resolve) => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((payload) => resolve({ type: 'json', payload, res }))
    };

    const next = jest.fn((err) => resolve({ type: 'next', err, res, next }));

    try {
      handler(req, res, next);
    } catch (err) {
      resolve({ type: 'next', err, res, next });
    }
  });
};

describe('messageController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getOrCreateConversation returns 201 for newly created conversation', async () => {
    createOrGetConversationForOrder.mockResolvedValue({
      conversation: { _id: 'conv_1' },
      isNew: true,
      unreadCount: 0
    });

    const result = await runHandler(getOrCreateConversation, {
      params: { orderId: 'order_1' },
      user: { _id: 'user_1' }
    });

    expect(createOrGetConversationForOrder).toHaveBeenCalledWith({
      orderId: 'order_1',
      userId: 'user_1'
    });
    expect(result.type).toBe('json');
    expect(result.res.status).toHaveBeenCalledWith(201);
    expect(result.payload.success).toBe(true);
    expect(result.payload.data.isNew).toBe(true);
  });

  test('getOrCreateConversation returns 200 when conversation already exists', async () => {
    createOrGetConversationForOrder.mockResolvedValue({
      conversation: { _id: 'conv_1' },
      isNew: false,
      unreadCount: 3
    });

    const result = await runHandler(getOrCreateConversation, {
      params: { orderId: 'order_1' },
      user: { _id: 'user_1' }
    });

    expect(result.type).toBe('json');
    expect(result.res.status).toHaveBeenCalledWith(200);
    expect(result.payload.data.unreadCount).toBe(3);
  });

  test('getMyConversations returns count and conversation list', async () => {
    listConversationsForUser.mockResolvedValue([
      { conversation: { _id: 'conv_1' }, unreadCount: 2 },
      { conversation: { _id: 'conv_2' }, unreadCount: 0 }
    ]);

    const result = await runHandler(getMyConversations, {
      user: { _id: 'user_1' }
    });

    expect(listConversationsForUser).toHaveBeenCalledWith('user_1');
    expect(result.type).toBe('json');
    expect(result.res.status).toHaveBeenCalledWith(200);
    expect(result.payload.count).toBe(2);
  });

  test('getMessages forwards cursor params and returns message payload', async () => {
    getConversationMessages.mockResolvedValue({
      messages: [{ _id: 'msg_1' }],
      nextCursor: null,
      count: 1
    });

    const result = await runHandler(getMessages, {
      params: { conversationId: 'conv_1' },
      query: { before: '2026-04-20T00:00:00.000Z', limit: '20' },
      user: { _id: 'user_1' }
    });

    expect(getConversationMessages).toHaveBeenCalledWith({
      conversationId: 'conv_1',
      userId: 'user_1',
      before: '2026-04-20T00:00:00.000Z',
      limit: '20'
    });
    expect(result.type).toBe('json');
    expect(result.res.status).toHaveBeenCalledWith(200);
    expect(result.payload.data.count).toBe(1);
  });

  test('createMessage emits socket event when io instance exists', async () => {
    const emit = jest.fn();
    const to = jest.fn(() => ({ emit }));
    getIO.mockReturnValue({ to });

    sendMessage.mockResolvedValue({
      message: { _id: 'msg_1', content: 'hello there' }
    });

    const result = await runHandler(createMessage, {
      params: { conversationId: 'conv_1' },
      body: { content: 'hello there' },
      user: { _id: 'user_1' }
    });

    expect(sendMessage).toHaveBeenCalledWith({
      conversationId: 'conv_1',
      senderId: 'user_1',
      content: 'hello there'
    });

    expect(to).toHaveBeenCalledWith('conversation:conv_1');
    expect(emit).toHaveBeenCalledWith('message:new', {
      conversationId: 'conv_1',
      message: { _id: 'msg_1', content: 'hello there' }
    });

    expect(result.type).toBe('json');
    expect(result.res.status).toHaveBeenCalledWith(201);
    expect(result.payload.success).toBe(true);
  });

  test('createMessage succeeds without socket instance', async () => {
    getIO.mockReturnValue(null);
    sendMessage.mockResolvedValue({
      message: { _id: 'msg_1', content: 'fallback path' }
    });

    const result = await runHandler(createMessage, {
      params: { conversationId: 'conv_1' },
      body: { content: 'fallback path' },
      user: { _id: 'user_1' }
    });

    expect(result.type).toBe('json');
    expect(result.res.status).toHaveBeenCalledWith(201);
    expect(result.payload.data.message.content).toBe('fallback path');
  });

  test('readConversation returns unreadCount from service', async () => {
    markConversationRead.mockResolvedValue({ unreadCount: 0 });

    const result = await runHandler(readConversation, {
      params: { conversationId: 'conv_1' },
      user: { _id: 'user_1' }
    });

    expect(markConversationRead).toHaveBeenCalledWith({
      conversationId: 'conv_1',
      userId: 'user_1'
    });
    expect(result.type).toBe('json');
    expect(result.res.status).toHaveBeenCalledWith(200);
    expect(result.payload.data.unreadCount).toBe(0);
  });

  test('catchAsync forwards service errors to next', async () => {
    sendMessage.mockRejectedValue(new AppError('Conversation not found', 404));

    const result = await runHandler(createMessage, {
      params: { conversationId: 'conv_missing' },
      body: { content: 'hello' },
      user: { _id: 'user_1' }
    });

    expect(result.type).toBe('next');
    expect(result.err).toBeInstanceOf(AppError);
    expect(result.err.statusCode).toBe(404);
  });
});
