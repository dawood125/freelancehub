const catchAsync = require('../utils/catchAsync');
const {
  listNotificationsForUser,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead
} = require('../services/notificationService');

const getMyNotifications = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = 'false' } = req.query;

  const result = await listNotificationsForUser({
    userId: req.user._id,
    page,
    limit,
    unreadOnly: unreadOnly === 'true'
  });

  res.status(200).json({
    success: true,
    ...result
  });
});

const getMyUnreadCount = catchAsync(async (req, res) => {
  const unreadCount = await getUnreadCount(req.user._id);

  res.status(200).json({
    success: true,
    data: { unreadCount }
  });
});

const readNotification = catchAsync(async (req, res) => {
  const notification = await markNotificationRead({
    notificationId: req.params.notificationId,
    userId: req.user._id
  });

  res.status(200).json({
    success: true,
    message: 'Notification marked as read.',
    data: { notification }
  });
});

const readAllNotifications = catchAsync(async (req, res) => {
  await markAllNotificationsRead(req.user._id);

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read.'
  });
});

module.exports = {
  getMyNotifications,
  getMyUnreadCount,
  readNotification,
  readAllNotifications
};