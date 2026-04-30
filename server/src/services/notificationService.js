const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');
const { getIO } = require('../sockets/socketServer');

const normalizePositiveInteger = (value, fallback, max) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
};

const populateNotification = (query) => {
  return query
    .populate('recipient', 'name username avatar')
    .populate('actor', 'name username avatar');
};

const emitNotification = (notification) => {
  const io = getIO();
  if (!io || !notification?.recipient?._id) return;

  io.to(`user:${notification.recipient._id.toString()}`).emit('notification:new', {
    notification
  });
};

const createNotification = async ({
  recipientId,
  actorId = null,
  type,
  title,
  body,
  link = '',
  entityType = '',
  entityId = null,
  metadata = {}
}) => {
  if (!recipientId) {
    throw new AppError('Notification recipient is required', 400);
  }

  const notification = await Notification.create({
    recipient: recipientId,
    actor: actorId || undefined,
    type,
    title,
    body,
    link,
    entityType,
    entityId,
    metadata
  });

  const populated = await populateNotification(Notification.findById(notification._id));
  emitNotification(populated);
  return populated;
};

const listNotificationsForUser = async ({ userId, page = 1, limit = 20, unreadOnly = false }) => {
  const safePage = normalizePositiveInteger(page, 1, 1000);
  const safeLimit = normalizePositiveInteger(limit, 20, 100);
  const skip = (safePage - 1) * safeLimit;

  const query = { recipient: userId };
  if (unreadOnly) {
    query.readAt = null;
  }

  const [notifications, total] = await Promise.all([
    populateNotification(
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
    ),
    Notification.countDocuments(query)
  ]);

  return {
    notifications,
    count: notifications.length,
    total,
    page: safePage,
    pages: Math.ceil(total / safeLimit)
  };
};

const getUnreadCount = async (userId) => {
  return Notification.countDocuments({ recipient: userId, readAt: null });
};

const markNotificationRead = async ({ notificationId, userId }) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      recipient: userId
    },
    {
      $set: { readAt: new Date() }
    },
    { new: true }
  );

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  return populateNotification(Notification.findById(notification._id));
};

const markAllNotificationsRead = async (userId) => {
  await Notification.updateMany(
    {
      recipient: userId,
      readAt: null
    },
    {
      $set: { readAt: new Date() }
    }
  );

  return true;
};

module.exports = {
  createNotification,
  listNotificationsForUser,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead
};