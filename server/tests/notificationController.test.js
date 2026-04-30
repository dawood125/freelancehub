const AppError = require('../src/utils/AppError');

jest.mock('../src/services/notificationService', () => ({
  listNotificationsForUser: jest.fn(),
  getUnreadCount: jest.fn(),
  markNotificationRead: jest.fn(),
  markAllNotificationsRead: jest.fn()
}));

const {
  listNotificationsForUser,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead
} = require('../src/services/notificationService');

const {
  getMyNotifications,
  getMyUnreadCount,
  readNotification,
  readAllNotifications
} = require('../src/controllers/notificationController');

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

describe('notificationController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getMyNotifications returns notification list and pagination metadata', async () => {
    listNotificationsForUser.mockResolvedValue({
      notifications: [{ _id: 'n1' }],
      count: 1,
      total: 1,
      page: 1,
      pages: 1
    });

    const result = await runHandler(getMyNotifications, {
      query: { page: '1', limit: '10', unreadOnly: 'true' },
      user: { _id: 'user_1' }
    });

    expect(listNotificationsForUser).toHaveBeenCalledWith({
      userId: 'user_1',
      page: '1',
      limit: '10',
      unreadOnly: true
    });
    expect(result.type).toBe('json');
    expect(result.res.status).toHaveBeenCalledWith(200);
    expect(result.payload.count).toBe(1);
  });

  test('getMyUnreadCount returns unread count', async () => {
    getUnreadCount.mockResolvedValue(4);

    const result = await runHandler(getMyUnreadCount, {
      user: { _id: 'user_1' }
    });

    expect(getUnreadCount).toHaveBeenCalledWith('user_1');
    expect(result.type).toBe('json');
    expect(result.res.status).toHaveBeenCalledWith(200);
    expect(result.payload.data.unreadCount).toBe(4);
  });

  test('readNotification returns marked notification', async () => {
    markNotificationRead.mockResolvedValue({ _id: 'n1', readAt: new Date() });

    const result = await runHandler(readNotification, {
      params: { notificationId: 'n1' },
      user: { _id: 'user_1' }
    });

    expect(markNotificationRead).toHaveBeenCalledWith({
      notificationId: 'n1',
      userId: 'user_1'
    });
    expect(result.type).toBe('json');
    expect(result.res.status).toHaveBeenCalledWith(200);
    expect(result.payload.success).toBe(true);
  });

  test('readAllNotifications marks all user notifications as read', async () => {
    markAllNotificationsRead.mockResolvedValue(true);

    const result = await runHandler(readAllNotifications, {
      user: { _id: 'user_1' }
    });

    expect(markAllNotificationsRead).toHaveBeenCalledWith('user_1');
    expect(result.type).toBe('json');
    expect(result.res.status).toHaveBeenCalledWith(200);
    expect(result.payload.message).toMatch(/marked as read/i);
  });

  test('readNotification forwards service errors', async () => {
    markNotificationRead.mockRejectedValue(new AppError('Notification not found', 404));

    const result = await runHandler(readNotification, {
      params: { notificationId: 'missing' },
      user: { _id: 'user_1' }
    });

    expect(result.type).toBe('next');
    expect(result.err).toBeInstanceOf(AppError);
    expect(result.err.statusCode).toBe(404);
  });
});
