import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiShoppingBag, FiCheckCircle, FiClock, FiStar, FiMessageSquare } from 'react-icons/fi';
import api from '../../services/api';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/orders/stats');
        setStats(response.data.data);
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchStats();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  const isFreelancer = user?.currentRole === 'freelancer';
  const currentStats = isFreelancer ? stats?.asSeller : stats?.asBuyer;

  const statCards = isFreelancer ? [
    { title: 'Total Earnings', value: `$${currentStats?.totalAmount || 0}`, icon: <FiTrendingUp />, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Active Orders', value: (currentStats?.in_progress || 0) + (currentStats?.revision_requested || 0), icon: <FiClock />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Completed', value: currentStats?.completed || 0, icon: <FiCheckCircle />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Rating', value: user?.freelancerProfile?.averageRating?.toFixed(1) || '0.0', icon: <FiStar />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ] : [
    { title: 'Total Spent', value: `$${currentStats?.totalAmount || 0}`, icon: <FiShoppingBag />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Active Orders', value: (currentStats?.in_progress || 0) + (currentStats?.revision_requested || 0), icon: <FiClock />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Completed', value: currentStats?.completed || 0, icon: <FiCheckCircle />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="min-h-screen bg-[color:var(--bg)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-extrabold text-[color:var(--text-1)]">
              Welcome back, {user?.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-[color:var(--text-2)] mt-1">
              {isFreelancer ? "Here's what's happening with your business today." : "Here's the status of your projects."}
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
            {isFreelancer && (
              <Link to="/create-gig" className="ui-btn-primary px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-green-500/25 transition-all hover:-translate-y-0.5">
                Create New Gig
              </Link>
            )}
            <Link to="/orders" className="px-5 py-2.5 rounded-xl font-medium border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-1)] hover:bg-[color:var(--surface-soft)] transition-all">
              Manage Orders
            </Link>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, idx) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-2xl p-6 border border-[color:var(--line)] hover:border-[color:var(--line-strong)] transition-all duration-300 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[color:var(--text-3)] text-sm font-semibold uppercase tracking-wider mb-2">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-[color:var(--text-1)]">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-6 border border-[color:var(--line)] shadow-sm">
            <h3 className="text-xl font-bold text-[color:var(--text-1)] mb-4 flex items-center gap-2">
              <FiClock className="text-[color:var(--text-muted)]" />
              Recent Orders
            </h3>
            <p className="text-[color:var(--text-2)] mb-6 text-sm">Track your ongoing projects and deliveries.</p>
            <Link to="/orders" className="text-green-500 font-medium hover:text-green-600 flex items-center gap-1 text-sm transition-colors">
              View all orders &rarr;
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-2xl p-6 border border-[color:var(--line)] shadow-sm">
            <h3 className="text-xl font-bold text-[color:var(--text-1)] mb-4 flex items-center gap-2">
              <FiMessageSquare className="text-[color:var(--text-muted)]" />
              Unread Messages
            </h3>
            <p className="text-[color:var(--text-2)] mb-6 text-sm">Stay in touch with your clients and freelancers.</p>
            <Link to="/messages" className="text-green-500 font-medium hover:text-green-600 flex items-center gap-1 text-sm transition-colors">
              Go to inbox &rarr;
            </Link>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
