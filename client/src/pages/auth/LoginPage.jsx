import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import authService from '../../services/authService';

const LoginPage = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {

    setFormData({
      ...formData,                    
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success(`Welcome back, ${response.data.user.name}! 👋`);
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[color:var(--bg)]">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r border-[color:var(--line)] bg-[color:var(--bg-soft)]">
        <div className="absolute -top-24 -left-16 w-80 h-80 rounded-full blur-3xl bg-[rgba(var(--accent-rgb),0.2)]" />
        <div className="absolute -bottom-16 right-0 w-96 h-96 rounded-full blur-3xl bg-[rgba(var(--accent-2-rgb),0.18)]" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full blur-3xl bg-[rgba(var(--ok-rgb),0.12)]" />

        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `linear-gradient(to right, color-mix(in srgb, var(--line) 65%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--line) 65%, transparent) 1px, transparent 1px)`,
            backgroundSize: '34px 34px'
          }}
        />

        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/" className="flex items-center space-x-2.5 mb-12">
              <div className="w-12 h-12 brand-gradient rounded-xl flex items-center justify-center shadow-lg shadow-[rgba(var(--accent-rgb),0.35)]">
                <span className="text-white font-bold text-2xl">F</span>
              </div>
              <span className="text-3xl font-bold text-[color:var(--text-1)]">
                Freelance<span className="text-[rgb(var(--accent-rgb))]">Hub</span>
              </span>
            </Link>

            <h2 className="text-4xl font-bold text-[color:var(--text-1)] mb-6 leading-tight">
              Welcome back to
              <span className="block text-gradient">
                your workspace
              </span>
            </h2>

            <p className="text-[color:var(--text-2)] text-lg mb-10 leading-relaxed max-w-md">
              Access your projects, connect with clients, and continue growing your freelance career.
            </p>

            <div className="space-y-4">
              {[
                'Secure escrow payments',
                'Real-time messaging',
                'Thousands of opportunities'
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-[rgba(var(--accent-rgb),0.2)] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[rgb(var(--accent-rgb))]" />
                  </div>
                  <span className="text-[color:var(--text-2)]">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-12 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-48 h-48 rounded-full blur-3xl bg-[rgba(var(--accent-rgb),0.14)]" />
          <div className="absolute bottom-6 left-6 w-60 h-60 rounded-full blur-3xl bg-[rgba(var(--accent-2-rgb),0.12)]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 relative"
        >
          <Link to="/" className="flex lg:hidden items-center space-x-2 mb-10 justify-center">
            <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-2xl font-bold text-[color:var(--text-1)]">
              Freelance<span className="text-[rgb(var(--accent-rgb))]">Hub</span>
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[color:var(--text-1)] mb-2">
              Sign in
            </h1>
            <p className="text-[color:var(--text-2)]">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-[rgb(var(--accent-rgb))] font-semibold hover:opacity-80 transition-colors">
                Create one free
              </Link>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <button className="ui-btn-secondary flex items-center justify-center gap-2.5 px-4 py-3 font-medium transition-all duration-300 group">
              <FcGoogle className="w-5 h-5" />
              <span className="text-sm">Google</span>
            </button>
            <button className="ui-btn-secondary flex items-center justify-center gap-2.5 px-4 py-3 font-medium transition-all duration-300">
              <FaGithub className="w-5 h-5" />
              <span className="text-sm">GitHub</span>
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[color:var(--line)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[color:var(--surface-card)] text-[color:var(--text-muted)]">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[color:var(--text-2)] mb-2">
                Email address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[color:var(--text-muted)]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="ui-input w-full pl-12 pr-4 py-3.5 placeholder:text-[color:var(--text-muted)] transition-colors duration-300"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-[color:var(--text-2)]">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-[rgb(var(--accent-rgb))] font-medium hover:opacity-80 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[color:var(--text-muted)]" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="ui-input w-full pl-12 pr-12 py-3.5 placeholder:text-[color:var(--text-muted)] transition-colors duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] hover:text-[color:var(--text-1)] transition-colors"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="ui-btn-primary w-full flex items-center justify-center gap-2 py-3.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <FiArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[color:var(--text-muted)]">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-[color:var(--text-2)] hover:text-[rgb(var(--accent-rgb))] transition-colors">
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-[color:var(--text-2)] hover:text-[rgb(var(--accent-rgb))] transition-colors">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;