import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { FiMessageSquare, FiSend, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import messageService from '../../services/messageService';

const resolveSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace(/\/api\/?$/, '');
};

const getCurrentUserId = () => {
  try {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) return '';

    const parsed = JSON.parse(rawUser);
    return parsed?._id || '';
  } catch {
    return '';
  }
};

const formatTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MessagesPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const socketRef = useRef(null);
  const messagePaneRef = useRef(null);

  const [isBooting, setIsBooting] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState('');
  const [messages, setMessages] = useState([]);
  const [draftMessage, setDraftMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const token = useMemo(() => localStorage.getItem('token') || '', []);
  const currentUserId = useMemo(() => getCurrentUserId(), []);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    bootstrap();
  }, []);

  useEffect(() => {
    if (!token) return;

    const socket = io(resolveSocketUrl(), {
      auth: { token },
      transports: ['websocket']
    });

    socketRef.current = socket;

    socket.on('message:new', ({ conversationId, message }) => {
      if (!conversationId || !message) return;

      setConversations((prev) => {
        const next = [...prev];
        const idx = next.findIndex((entry) => entry.conversation._id === conversationId);
        if (idx === -1) return prev;

        const current = next[idx];
        const shouldIncrementUnread =
          conversationId !== selectedConversationId &&
          message?.sender?._id !== currentUserId;

        const unreadCount = shouldIncrementUnread
          ? (current.unreadCount || 0) + 1
          : current.unreadCount || 0;

        next[idx] = {
          ...current,
          unreadCount,
          conversation: {
            ...current.conversation,
            lastMessage: {
              text: message.content,
              sender: message.sender,
              createdAt: message.createdAt
            },
            lastMessageAt: message.createdAt
          }
        };

        next.sort((a, b) => {
          const aTime = new Date(a.conversation.lastMessageAt || 0).getTime();
          const bTime = new Date(b.conversation.lastMessageAt || 0).getTime();
          return bTime - aTime;
        });

        return next;
      });

      if (conversationId === selectedConversationId) {
        setMessages((prev) => {
          if (prev.some((item) => item._id === message._id)) {
            return prev;
          }
          return [...prev, message];
        });
      }
    });

    socket.on('socket:error', (payload) => {
      if (payload?.message) {
        toast.error(payload.message);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, selectedConversationId, currentUserId]);

  useEffect(() => {
    if (!selectedConversationId || !socketRef.current) return;
    socketRef.current.emit('conversation:join', { conversationId: selectedConversationId });
  }, [selectedConversationId]);

  useEffect(() => {
    if (!messagePaneRef.current) return;
    messagePaneRef.current.scrollTop = messagePaneRef.current.scrollHeight;
  }, [messages]);

  const bootstrap = async () => {
    setIsBooting(true);
    try {
      const orderId = searchParams.get('orderId');
      const queryConversation = searchParams.get('conversation');

      if (orderId) {
        const response = await messageService.getOrCreateConversation(orderId);
        const conversationId = response.data.conversation._id;
        setSearchParams({ conversation: conversationId });
      }

      await loadConversations({ preferredConversationId: queryConversation });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load messages.';
      toast.error(message);
    } finally {
      setIsBooting(false);
    }
  };

  const loadConversations = async ({ preferredConversationId } = {}) => {
    const response = await messageService.getConversations();
    const entries = response.data.conversations || [];
    setConversations(entries);

    if (!entries.length) {
      setSelectedConversationId('');
      setMessages([]);
      return;
    }

    const conversationToOpen =
      preferredConversationId && entries.some((entry) => entry.conversation._id === preferredConversationId)
        ? preferredConversationId
        : entries[0].conversation._id;

    await selectConversation(conversationToOpen);
  };

  const selectConversation = async (conversationId) => {
    if (!conversationId) return;

    setSelectedConversationId(conversationId);
    setIsLoadingMessages(true);

    try {
      const response = await messageService.getMessages(conversationId);
      setMessages(response.data.messages || []);

      await messageService.markAsRead(conversationId);

      setConversations((prev) => prev.map((entry) => (
        entry.conversation._id === conversationId
          ? { ...entry, unreadCount: 0 }
          : entry
      )));

      if (socketRef.current) {
        socketRef.current.emit('conversation:read', { conversationId });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load conversation.';
      toast.error(message);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    const content = draftMessage.trim();
    if (!content || !selectedConversationId || isSending) return;

    setIsSending(true);

    try {
      const response = await messageService.sendMessage(selectedConversationId, content);
      const sentMessage = response.data.message;

      setDraftMessage('');

      setMessages((prev) => {
        if (prev.some((item) => item._id === sentMessage._id)) {
          return prev;
        }
        return [...prev, sentMessage];
      });

      setConversations((prev) => {
        const next = [...prev];
        const idx = next.findIndex((entry) => entry.conversation._id === selectedConversationId);
        if (idx === -1) return prev;

        next[idx] = {
          ...next[idx],
          conversation: {
            ...next[idx].conversation,
            lastMessage: {
              text: sentMessage.content,
              sender: sentMessage.sender,
              createdAt: sentMessage.createdAt
            },
            lastMessageAt: sentMessage.createdAt
          }
        };

        next.sort((a, b) => {
          const aTime = new Date(a.conversation.lastMessageAt || 0).getTime();
          const bTime = new Date(b.conversation.lastMessageAt || 0).getTime();
          return bTime - aTime;
        });

        return next;
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send message.';
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  const selectedConversation = conversations.find(
    (entry) => entry.conversation._id === selectedConversationId
  );

  return (
    <div className="min-h-screen bg-[color:var(--bg)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[color:var(--text-1)]">Messages</h1>
            <p className="text-sm text-[color:var(--text-2)] mt-1">
              Talk with buyers and sellers in real time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 ui-btn-secondary px-4 py-2 text-sm"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Orders
            </Link>
            <button
              type="button"
              onClick={bootstrap}
              className="inline-flex items-center gap-2 ui-btn-secondary px-4 py-2 text-sm"
            >
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {isBooting ? (
          <div className="glass-card rounded-2xl p-10 text-center">
            <div className="mx-auto w-8 h-8 border-2 border-[rgba(var(--accent-rgb),0.25)] border-t-[rgb(var(--accent-rgb))] rounded-full animate-spin" />
            <p className="mt-3 text-sm text-[color:var(--text-2)]">Loading conversations...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-4 ui-card p-4 max-h-[70vh] overflow-auto">
              <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[color:var(--text-3)] mb-3">
                Conversations
              </h2>

              {!conversations.length ? (
                <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-5 text-center">
                  <FiMessageSquare className="w-6 h-6 mx-auto text-[color:var(--text-3)]" />
                  <p className="mt-2 text-sm text-[color:var(--text-2)]">No conversations yet.</p>
                  <p className="text-xs text-[color:var(--text-3)] mt-1">Create one from an order page.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.map((entry) => {
                    const { conversation, unreadCount } = entry;
                    const isActive = conversation._id === selectedConversationId;

                    const otherParticipant = (conversation.participants || []).find(
                      (participant) => participant._id !== currentUserId
                    ) || conversation.participants?.[0];

                    return (
                      <button
                        key={conversation._id}
                        type="button"
                        onClick={() => selectConversation(conversation._id)}
                        className={`w-full text-left rounded-xl border p-3 transition-all ${
                          isActive
                            ? 'border-[rgba(var(--accent-rgb),0.45)] bg-[rgba(var(--accent-rgb),0.09)]'
                            : 'border-[color:var(--line)] bg-[color:var(--surface-soft)] hover:border-[color:var(--line-strong)]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-[color:var(--text-1)] truncate">
                              {otherParticipant?.name || otherParticipant?.username || 'Conversation'}
                            </p>
                            <p className="text-xs text-[color:var(--text-3)] truncate mt-0.5">
                              {conversation.lastMessage?.text || 'No messages yet'}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-[10px] text-[color:var(--text-3)]">
                              {formatTime(conversation.lastMessageAt)}
                            </p>
                            {unreadCount > 0 && (
                              <span className="mt-1 inline-flex min-w-5 h-5 px-1.5 items-center justify-center rounded-full bg-[rgb(var(--accent-rgb))] text-white text-[10px] font-bold">
                                {unreadCount > 99 ? '99+' : unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </aside>

            <section className="lg:col-span-8 glass-card rounded-2xl p-4 sm:p-5 min-h-[70vh] flex flex-col">
              {!selectedConversation ? (
                <div className="flex-1 flex items-center justify-center text-center">
                  <div>
                    <FiMessageSquare className="w-8 h-8 mx-auto text-[color:var(--text-3)]" />
                    <p className="mt-2 text-sm text-[color:var(--text-2)]">Select a conversation to start chatting.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="px-1 pb-3 mb-3 border-b border-[color:var(--line)]">
                    <p className="text-sm font-semibold text-[color:var(--text-1)]">Conversation</p>
                    <p className="text-xs text-[color:var(--text-3)]">Order linked secure chat</p>
                  </div>

                  <div ref={messagePaneRef} className="flex-1 overflow-auto pr-1 space-y-3">
                    {isLoadingMessages ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="w-7 h-7 border-2 border-[rgba(var(--accent-rgb),0.25)] border-t-[rgb(var(--accent-rgb))] rounded-full animate-spin" />
                      </div>
                    ) : messages.length ? (
                      messages.map((message) => {
                        const isMine = message.sender?._id === currentUserId;

                        return (
                          <div
                            key={message._id}
                            className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 border ${
                                isMine
                                  ? 'bg-[rgba(var(--accent-rgb),0.14)] border-[rgba(var(--accent-rgb),0.28)] text-[color:var(--text-1)]'
                                  : 'bg-[color:var(--surface-soft)] border-[color:var(--line)] text-[color:var(--text-1)]'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                              <p className="text-[10px] text-[color:var(--text-3)] mt-1 text-right">
                                {formatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="h-full flex items-center justify-center text-center">
                        <div>
                          <p className="text-sm text-[color:var(--text-2)]">No messages yet.</p>
                          <p className="text-xs text-[color:var(--text-3)] mt-1">Send the first message.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSend} className="pt-3 mt-3 border-t border-[color:var(--line)]">
                    <div className="flex items-end gap-2">
                      <textarea
                        value={draftMessage}
                        onChange={(e) => setDraftMessage(e.target.value)}
                        placeholder="Write a message..."
                        rows={2}
                        maxLength={2000}
                        className="ui-input flex-1 resize-none"
                      />
                      <button
                        type="submit"
                        disabled={!draftMessage.trim() || isSending}
                        className="ui-btn-primary px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="inline-flex items-center gap-2 text-sm font-semibold">
                          <FiSend className="w-4 h-4" />
                          Send
                        </span>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
