import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiBell, FiCheck, FiRefreshCw, FiExternalLink, FiInbox } from 'react-icons/fi';
import notificationService from '../../services/notificationService';

const formatRelativeTime = (value) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const getNotificationTone = (type) => {
  if (type === 'message_received') return 'bg-[rgba(var(--accent-rgb),0.14)] text-[rgb(var(--accent-rgb))]';
  if (type === 'payment_succeeded' || type === 'order_completed') return 'bg-[rgba(var(--ok-rgb),0.14)] text-[rgb(var(--ok-rgb))]';
  if (type === 'order_cancelled' || type === 'payment_failed') return 'bg-[rgba(var(--danger-rgb),0.12)] text-[rgb(var(--danger-rgb))]';
  return 'bg-[color:var(--surface-soft)] text-[color:var(--text-2)]';
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const unreadCountLabel = useMemo(() => {
    if (unreadCount > 99) return '99+';
    return String(unreadCount);
  }, [unreadCount]);

  const loadNotifications = async ({ silent = false } = {}) => {
    if (!silent) setIsRefreshing(true);

    try {
      const [listResponse, unreadResponse] = await Promise.all([
        notificationService.getNotifications({ unreadOnly: String(showUnreadOnly) }),
        notificationService.getUnreadCount()
      ]);

      setNotifications(listResponse.notifications || []);
      setUnreadCount(unreadResponse.data?.unreadCount || 0);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load notifications.';
      toast.error(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showUnreadOnly]);

  const handleMarkRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) => prev.map((item) => (
        item._id === notificationId
          ? { ...item, readAt: new Date().toISOString(), isRead: true }
          : item
      )));
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to mark notification as read.';
      toast.error(message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString(), isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read.');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to mark notifications as read.';
      toast.error(message);
    }
  };

  const handleOpenNotification = async (notification) => {
    if (!notification?.link) return;

    if (!notification.isRead) {
      await handleMarkRead(notification._id);
    }

    if (notification.link.startsWith('/')) {
      navigate(notification.link);
      return;
    }

    window.location.href = notification.link;
  };

  return (
    <div className="min-h-screen bg-(--bg) py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border-(--line) bg-(--surface-card) px-3 py-1 text-xs font-semibold text-(--text-2) mb-3">
              <FiBell className="w-3.5 h-3.5" />
              Notification Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-(--text-1)">Notifications</h1>
            <p className="text-sm text-(--text-2) mt-1">Track marketplace events in one place.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadNotifications({ silent: true })}
              className="inline-flex items-center gap-2 ui-btn-secondary px-4 py-2 text-sm"
            >
              <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={!unreadCount}
              className="inline-flex items-center gap-2 ui-btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiCheck className="w-4 h-4" />
              Mark all read
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-4 ui-card p-4 h-fit">
            <div className="rounded-2xl bg-(--surface-soft) border border-(--line) p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-(--text-3) font-semibold">Unread</p>
                  <p className="mt-1 text-3xl font-extrabold text-(--text-1)">{unreadCountLabel}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center text-white shadow-lg">
                  <FiInbox className="w-6 h-6" />
                </div>
              </div>

              <label className="mt-5 inline-flex items-center gap-2 text-sm text-(--text-2)">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-(--line) text-[rgb(var(--accent-rgb))] focus:ring-[rgb(var(--accent-rgb))]"
                />
                Show unread only
              </label>
            </div>

            <div className="mt-4 rounded-2xl border border-(--line) bg-(--surface-card) p-4">
              <p className="text-sm font-semibold text-(--text-1)">How it works</p>
              <p className="mt-2 text-sm text-(--text-2) leading-relaxed">
                Notifications are generated from core marketplace events like messages and payment confirmations.
              </p>
            </div>
          </aside>

          <section className="lg:col-span-8 space-y-3">
            {isLoading ? (
              <div className="glass-card rounded-2xl p-10 text-center">
                <div className="mx-auto w-8 h-8 border-2 border-[rgba(var(--accent-rgb),0.25)] border-t-[rgb(var(--accent-rgb))] rounded-full animate-spin" />
                <p className="mt-3 text-sm text-(--text-2)">Loading notifications...</p>
              </div>
            ) : notifications.length ? (
              notifications.map((notification) => (
                <article
                  key={notification._id}
                  className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                    notification.isRead
                      ? 'border-(--line) bg-(--surface-card)'
                      : 'border-[rgba(var(--accent-rgb),0.3)] bg-[rgba(var(--accent-rgb),0.06)]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${getNotificationTone(notification.type)}`}>
                      <FiBell className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-base font-bold text-(--text-1)">{notification.title}</h2>
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${getNotificationTone(notification.type)}`}>
                              {notification.type.replaceAll('_', ' ')}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-(--text-2) leading-relaxed">{notification.body}</p>
                          <div className="mt-2 flex items-center gap-3 text-xs text-(--text-3)">
                            <span>{formatRelativeTime(notification.createdAt)}</span>
                            {notification.actor?.name && <span>From {notification.actor.name}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {notification.link && (
                            <button
                              type="button"
                              onClick={() => handleOpenNotification(notification)}
                              className="inline-flex items-center gap-2 ui-btn-secondary px-3 py-2 text-xs"
                            >
                              Open
                              <FiExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {!notification.isRead && (
                            <button
                              type="button"
                              onClick={() => handleMarkRead(notification._id)}
                              className="inline-flex items-center gap-2 ui-btn-primary px-3 py-2 text-xs"
                            >
                              <FiCheck className="w-3.5 h-3.5" />
                              Read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="glass-card rounded-2xl p-10 text-center">
                <FiBell className="w-10 h-10 mx-auto text-(--text-3)" />
                <h2 className="mt-4 text-lg font-bold text-(--text-1)">No notifications yet</h2>
                <p className="mt-2 text-sm text-(--text-2) max-w-md mx-auto">
                  You’ll see payment updates, messages, and other marketplace events here.
                </p>
                <Link to="/gigs" className="inline-flex items-center gap-2 ui-btn-primary px-4 py-2.5 text-sm mt-5">
                  Explore gigs
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
