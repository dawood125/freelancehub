import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiClock, FiCheck, FiX, FiPackage, FiSend,
  FiRefreshCw, FiAlertCircle, FiArrowRight,
  FiFileText, FiDollarSign, FiStar
} from 'react-icons/fi';
import orderService from '../../services/orderService';

// Status config
const STATUS_CONFIG = {
  pending_requirements: { label: 'Pending Requirements', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: '⏳', step: 1 },
  in_progress: { label: 'In Progress', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: '🔨', step: 2 },
  delivered: { label: 'Delivered', color: 'text-purple-600 bg-purple-50 border-purple-200', icon: '📦', step: 3 },
  revision_requested: { label: 'Revision Requested', color: 'text-orange-600 bg-orange-50 border-orange-200', icon: '🔄', step: 2 },
  completed: { label: 'Completed', color: 'text-green-600 bg-green-50 border-green-200', icon: '✅', step: 4 },
  cancelled: { label: 'Cancelled', color: 'text-red-600 bg-red-50 border-red-200', icon: '❌', step: 0 },
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  // Action form states
  const [showRequirementsForm, setShowRequirementsForm] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [requirementsInput, setRequirementsInput] = useState([{ question: '', answer: '' }]);
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [revisionNote, setRevisionNote] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await orderService.getOrder(id);
      setOrder(response.data.order);
    } catch (error) {
      toast.error('Failed to load order');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">😕</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
          <Link to="/orders" className="text-green-600 font-medium">← Back to orders</Link>
        </div>
      </div>
    );
  }

  const isBuyer = order.buyer?._id === currentUser.id;
  const isSeller = order.seller?._id === currentUser.id;
  const statusConfig = STATUS_CONFIG[order.status] || {};

  // ===== ACTION HANDLERS =====
  const handleSubmitRequirements = async () => {
    const filled = requirementsInput.filter(r => r.answer.trim());
    if (filled.length === 0) {
      toast.error('Please provide at least one answer');
      return;
    }
    setActionLoading('requirements');
    try {
      const response = await orderService.submitRequirements(order._id, filled);
      setOrder(response.data.order);
      setShowRequirementsForm(false);
      toast.success('Requirements submitted!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit');
    } finally {
      setActionLoading('');
    }
  };

  const handleDeliver = async () => {
    if (!deliveryMessage.trim()) {
      toast.error('Please provide a delivery message');
      return;
    }
    setActionLoading('deliver');
    try {
      const response = await orderService.deliverOrder(order._id, deliveryMessage);
      setOrder(response.data.order);
      setShowDeliveryForm(false);
      setDeliveryMessage('');
      toast.success('Order delivered!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to deliver');
    } finally {
      setActionLoading('');
    }
  };

  const handleRevision = async () => {
    if (!revisionNote.trim()) {
      toast.error('Please explain what needs to change');
      return;
    }
    setActionLoading('revision');
    try {
      const response = await orderService.requestRevision(order._id, revisionNote);
      setOrder(response.data.order);
      setShowRevisionForm(false);
      setRevisionNote('');
      toast.success('Revision requested!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request revision');
    } finally {
      setActionLoading('');
    }
  };

  const handleAccept = async () => {
    setActionLoading('accept');
    try {
      const response = await orderService.acceptDelivery(order._id);
      setOrder(response.data.order);
      toast.success('Order completed! 🎉');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept');
    } finally {
      setActionLoading('');
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    setActionLoading('cancel');
    try {
      const response = await orderService.cancelOrder(order._id, cancelReason);
      setOrder(response.data.order);
      setShowCancelForm(false);
      toast.success('Order cancelled');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Link */}
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          ← Back to orders
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ===== LEFT COLUMN ===== */}
          <div className="lg:col-span-2 space-y-6">

            {/* Order Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-400 font-medium mb-1">Order #{order.orderNumber}</p>
                  <h1 className="text-xl font-bold text-gray-900">
                    {order.gig?.title || 'Gig unavailable'}
                  </h1>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full border ${statusConfig.color}`}>
                  {statusConfig.icon} {statusConfig.label}
                </span>
              </div>

              {/* Participants */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Buyer:</span>
                  <span className="font-medium text-gray-900">{order.buyer?.name} {isBuyer && '(You)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Seller:</span>
                  <span className="font-medium text-gray-900">{order.seller?.name} {isSeller && '(You)'}</span>
                </div>
              </div>
            </motion.div>

            {/* Progress Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <h3 className="font-bold text-gray-900 mb-5">Order Timeline</h3>
              <div className="space-y-4">
                {[
                  { label: 'Order Placed', date: order.timeline?.createdAt, done: true, icon: <FiPackage /> },
                  { label: 'Requirements Submitted', date: order.timeline?.requirementsAt, done: order.requirementsSubmitted, icon: <FiFileText /> },
                  { label: 'Work Started', date: order.timeline?.startedAt, done: !!order.timeline?.startedAt, icon: <FiClock /> },
                  { label: 'Delivered', date: order.timeline?.deliveredAt, done: !!order.timeline?.deliveredAt, icon: <FiSend /> },
                  { label: 'Completed', date: order.timeline?.completedAt, done: order.status === 'completed', icon: <FiCheck /> },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      item.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 pt-1.5">
                      <p className={`text-sm font-medium ${item.done ? 'text-gray-900' : 'text-gray-400'}`}>
                        {item.label}
                      </p>
                      {item.date && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(item.date).toLocaleString('en-US', {
                            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Deliveries */}
            {order.deliveries && order.deliveries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
              >
                <h3 className="font-bold text-gray-900 mb-4">Deliveries ({order.deliveries.length})</h3>
                <div className="space-y-4">
                  {order.deliveries.map((delivery, index) => (
                    <div key={index} className={`p-4 rounded-xl border ${
                      delivery.status === 'accepted' ? 'border-green-200 bg-green-50/50' :
                      delivery.status === 'revision_requested' ? 'border-orange-200 bg-orange-50/50' :
                      'border-gray-200 bg-gray-50/50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-900">
                          Delivery #{index + 1}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          delivery.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          delivery.status === 'revision_requested' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {delivery.status === 'pending' ? 'Awaiting Review' : delivery.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{delivery.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(delivery.deliveredAt).toLocaleString()}
                      </p>
                      {delivery.revisionNote && (
                        <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                          <p className="text-xs font-semibold text-orange-600 mb-1">Revision Note:</p>
                          <p className="text-sm text-orange-700">{delivery.revisionNote}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ===== ACTION FORMS ===== */}

            {/* Requirements Form (Buyer) */}
            {isBuyer && order.status === 'pending_requirements' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border-2 border-amber-200 p-6 shadow-sm"
              >
                <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <FiAlertCircle className="w-5 h-5 text-amber-500" />
                  Submit Your Requirements
                </h3>
                <p className="text-sm text-gray-500 mb-4">Tell the seller what you need so they can start working.</p>

                <div className="space-y-3 mb-4">
                  {requirementsInput.map((req, index) => (
                    <div key={index} className="space-y-1.5">
                      <input
                        type="text"
                        value={req.question}
                        onChange={(e) => {
                          const updated = [...requirementsInput];
                          updated[index].question = e.target.value;
                          setRequirementsInput(updated);
                        }}
                        placeholder="Requirement topic (e.g., Website purpose)"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500"
                      />
                      <textarea
                        value={req.answer}
                        onChange={(e) => {
                          const updated = [...requirementsInput];
                          updated[index].answer = e.target.value;
                          setRequirementsInput(updated);
                        }}
                        placeholder="Your answer..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 resize-none"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setRequirementsInput([...requirementsInput, { question: '', answer: '' }])}
                    className="text-sm text-green-600 font-medium hover:text-green-700"
                  >
                    + Add more
                  </button>
                  <button
                    onClick={handleSubmitRequirements}
                    disabled={actionLoading === 'requirements'}
                    className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50 text-sm flex items-center gap-2"
                  >
                    {actionLoading === 'requirements' ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FiSend className="w-4 h-4" />
                    )}
                    Submit Requirements
                  </button>
                </div>
              </motion.div>
            )}

            {/* Deliver Form (Seller) */}
            {isSeller && ['in_progress', 'revision_requested'].includes(order.status) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-sm"
              >
                {!showDeliveryForm ? (
                  <button
                    onClick={() => setShowDeliveryForm(true)}
                    className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FiSend className="w-5 h-5" />
                    Deliver Your Work
                  </button>
                ) : (
                  <>
                    <h3 className="font-bold text-gray-900 mb-3">Deliver Your Work</h3>
                    <textarea
                      value={deliveryMessage}
                      onChange={(e) => setDeliveryMessage(e.target.value)}
                      placeholder="Describe what you're delivering. Include any instructions for the buyer..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 resize-none mb-4"
                    />
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setShowDeliveryForm(false)}
                        className="px-5 py-2.5 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeliver}
                        disabled={actionLoading === 'deliver'}
                        className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 text-sm flex items-center gap-2"
                      >
                        {actionLoading === 'deliver' ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <FiSend className="w-4 h-4" />
                        )}
                        Deliver
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Accept/Revision (Buyer on delivered) */}
            {isBuyer && order.status === 'delivered' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-sm"
              >
                <h3 className="font-bold text-gray-900 mb-1">Review Delivery</h3>
                <p className="text-sm text-gray-500 mb-4">Check the delivery above and accept or request changes.</p>

                {!showRevisionForm ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handleAccept}
                      disabled={actionLoading === 'accept'}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                      {actionLoading === 'accept' ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <FiCheck className="w-5 h-5" />
                      )}
                      Accept & Complete
                    </button>
                    <button
                      onClick={() => setShowRevisionForm(true)}
                      className="flex-1 py-3 border-2 border-orange-300 text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    >
                      <FiRefreshCw className="w-5 h-5" />
                      Request Revision
                    </button>
                  </div>
                ) : (
                  <>
                    <textarea
                      value={revisionNote}
                      onChange={(e) => setRevisionNote(e.target.value)}
                      placeholder="Explain what changes you need..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 resize-none mb-3"
                    />
                    <div className="flex gap-3 justify-end">
                      <button onClick={() => setShowRevisionForm(false)} className="px-5 py-2.5 text-gray-600 font-medium rounded-xl hover:bg-gray-100 text-sm">
                        Cancel
                      </button>
                      <button
                        onClick={handleRevision}
                        disabled={actionLoading === 'revision'}
                        className="px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 disabled:opacity-50 text-sm flex items-center gap-2"
                      >
                        {actionLoading === 'revision' && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        Submit Revision Request
                      </button>
                    </div>
                  </>
                )}

                {/* Revision count */}
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Revisions used: {order.revisions?.used || 0} / {order.revisions?.allowed === -1 ? 'Unlimited' : order.revisions?.allowed}
                </p>
              </motion.div>
            )}
          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div className="space-y-6">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Package</span>
                  <span className="font-semibold text-gray-900 capitalize">{order.package?.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price</span>
                  <span className="font-semibold text-gray-900">${order.pricing?.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Service Fee</span>
                  <span className="font-semibold text-gray-900">${order.pricing?.serviceFee}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-extrabold text-gray-900 text-lg">${order.pricing?.total}</span>
                </div>
              </div>
            </motion.div>

            {/* Delivery Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <h3 className="font-bold text-gray-900 mb-4">Delivery Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5"><FiClock className="w-4 h-4" /> Delivery Time</span>
                  <span className="font-semibold text-gray-900">{order.package?.deliveryDays} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5"><FiRefreshCw className="w-4 h-4" /> Revisions</span>
                  <span className="font-semibold text-gray-900">
                    {order.revisions?.used || 0} / {order.revisions?.allowed === -1 ? '∞' : order.revisions?.allowed}
                  </span>
                </div>
                {order.timeline?.expectedDeliveryAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Due Date</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(order.timeline.expectedDeliveryAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Cancel Button */}
            {!['completed', 'cancelled'].includes(order.status) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {!showCancelForm ? (
                  <button
                    onClick={() => setShowCancelForm(true)}
                    className="w-full py-3 text-red-500 font-medium border-2 border-red-200 rounded-xl hover:bg-red-50 transition-all duration-300 text-sm"
                  >
                    Cancel Order
                  </button>
                ) : (
                  <div className="bg-white rounded-2xl border-2 border-red-200 p-5">
                    <h4 className="font-bold text-red-600 text-sm mb-2">Cancel this order?</h4>
                    <textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Reason for cancellation..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-red-400 resize-none mb-3"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setShowCancelForm(false)} className="flex-1 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 text-sm">
                        Keep Order
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={actionLoading === 'cancel'}
                        className="flex-1 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 text-sm"
                      >
                        Confirm Cancel
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;