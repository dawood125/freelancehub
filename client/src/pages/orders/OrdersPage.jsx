import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiClock, FiPackage, FiArrowRight, FiFilter } from 'react-icons/fi';
import orderService from '../../services/orderService';

const STATUS_CONFIG = {
  pending_requirements: { label: 'Pending Requirements', color: 'bg-amber-100 text-amber-700', icon: '⏳' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: '🔨' },
  delivered: { label: 'Delivered', color: 'bg-purple-100 text-purple-700', icon: '📦' },
  revision_requested: { label: 'Revision Requested', color: 'bg-orange-100 text-orange-700', icon: '🔄' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: '✅' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: '❌' },
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentRole = searchParams.get('role') || '';
  const currentStatus = searchParams.get('status') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    fetchOrders();
  }, [searchParams]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (currentRole) params.role = currentRole;
      if (currentStatus) params.status = currentStatus;
      params.page = currentPage;
      params.limit = 10;

      const response = await orderService.getMyOrders(params);
      setOrders(response.data.orders);
      setTotalOrders(response.total);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') newParams.set('page', '1');
    setSearchParams(newParams);
  };

  // Get current user to determine if buyer/seller for each order
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-1">{totalOrders} order{totalOrders !== 1 ? 's' : ''}</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm"
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* Role filter */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              {[
                { value: '', label: 'All' },
                { value: 'buyer', label: 'As Buyer' },
                { value: 'seller', label: 'As Seller' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => updateFilter('role', option.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    currentRole === option.value
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <FiFilter className="w-4 h-4 text-gray-400" />
              {[
                { value: '', label: 'All Status' },
                { value: 'in_progress', label: 'Active' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => updateFilter('status', option.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-300 ${
                    currentStatus === option.value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-16 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded-full w-3/4" />
                    <div className="h-4 bg-gray-200 rounded-full w-1/2" />
                  </div>
                  <div className="h-8 bg-gray-200 rounded-full w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const statusConfig = STATUS_CONFIG[order.status] || {};
              const isBuyer = order.buyer?._id === currentUser.id;
              const otherParty = isBuyer ? order.seller : order.buyer;
              const gigImage = order.gig?.images?.[0]?.url || '';

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link
                    to={`/orders/${order._id}`}
                    className="block bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-transparent hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Gig Image */}
                      <div className="flex-shrink-0 w-24 h-18 rounded-xl overflow-hidden bg-gray-100">
                        {gigImage ? (
                          <img src={gigImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-2xl">
                            📦
                          </div>
                        )}
                      </div>

                      {/* Order Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate group-hover:text-green-600 transition-colors">
                              {order.gig?.title || 'Gig unavailable'}
                            </h3>
                            <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500">
                              <span className="font-medium text-gray-400">#{order.orderNumber}</span>
                              <span>•</span>
                              <span>{isBuyer ? 'Seller' : 'Buyer'}: {otherParty?.name}</span>
                              <span>•</span>
                              <span className="capitalize">{order.package?.type} Package</span>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right flex-shrink-0">
                            <p className="text-lg font-extrabold text-gray-900">
                              ${isBuyer ? order.pricing?.total : order.pricing?.sellerEarning}
                            </p>
                            <p className="text-xs text-gray-400">
                              {isBuyer ? 'Total paid' : 'Your earning'}
                            </p>
                          </div>
                        </div>

                        {/* Bottom row */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3">
                            {/* Status Badge */}
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                              <span>{statusConfig.icon}</span>
                              {statusConfig.label}
                            </span>

                            {/* Date */}
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <FiClock className="w-3 h-3" />
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric'
                              })}
                            </span>
                          </div>

                          <FiArrowRight className="w-4 h-4 text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <span className="text-6xl block mb-4">📦</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">
              {currentRole === 'seller'
                ? 'You haven\'t received any orders yet.'
                : 'You haven\'t placed any orders yet.'}
            </p>
            <Link
              to="/gigs"
              className="px-6 py-2.5 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors"
            >
              Browse Services
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;