// =====================================================
// REGISTER PAGE
// =====================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUser, FiAtSign, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import authService from '../../services/authService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    const levels = [
      { score: 0, label: '', color: '' },
      { score: 1, label: 'Weak', color: 'bg-red-500' },
      { score: 2, label: 'Fair', color: 'bg-orange-500' },
      { score: 3, label: 'Good', color: 'bg-amber-500' },
      { score: 4, label: 'Strong', color: 'bg-green-500' },
    ];

    return levels[score];
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.name.length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    if (formData.username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

  
    if (!/^[a-z0-9_]+$/.test(formData.username.toLowerCase())) {
      toast.error('Username can only contain lowercase letters, numbers, and underscores');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (!agreeTerms) {
      toast.error('Please agree to the Terms and Privacy Policy');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({
        ...formData,
        username: formData.username.toLowerCase(),
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success('Account created! Check your email for verification code 📧');

      navigate('/verify-email', { state: { email: formData.email } });
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[color:var(--bg)]">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full blur-3xl opacity-40 pointer-events-none" style={{ background: 'rgba(var(--accent-rgb), 0.15)' }} />
        <div className="absolute -bottom-24 right-0 w-96 h-96 rounded-full blur-3xl opacity-35 pointer-events-none" style={{ background: 'rgba(var(--accent-2-rgb), 0.14)' }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 relative z-10"
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
              Create your account
            </h1>
            <p className="text-[color:var(--text-2)]">
              Already have an account?{' '}
              <Link to="/login" className="text-[rgb(var(--accent-rgb))] font-semibold hover:opacity-90 transition-opacity">
                Sign in
              </Link>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <button className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-medium transition-all duration-300 border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-1)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]">
              <FcGoogle className="w-5 h-5" />
              <span className="text-sm">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-medium transition-all duration-300 border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-1)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]">
              <FaGithub className="w-5 h-5" />
              <span className="text-sm">GitHub</span>
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[color:var(--surface)] px-4 text-[color:var(--text-3)]">or register with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[color:var(--text-2)] mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[color:var(--text-3)]" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="ui-input w-full pl-12 pr-4 py-3.5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-[color:var(--text-2)] mb-2">
                Username
              </label>
              <div className="relative">
                <FiAtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[color:var(--text-3)]" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className="ui-input w-full pl-12 pr-4 py-3.5"
                />
              </div>
              {formData.username && (
                <p className="mt-1.5 text-xs text-[color:var(--text-3)]">
                  Your profile: freelancehub.com/<span className="text-[rgb(var(--accent-rgb))] font-medium">{formData.username.toLowerCase()}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[color:var(--text-2)] mb-2">
                Email address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[color:var(--text-3)]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="ui-input w-full pl-12 pr-4 py-3.5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[color:var(--text-2)] mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[color:var(--text-3)]" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className="ui-input w-full pl-12 pr-12 py-3.5"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--text-3)] hover:text-[color:var(--text-2)] transition-colors"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>

              {formData.password && (
                <div className="mt-3">
                  <div className="flex gap-1.5 mb-2">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                          level <= passwordStrength.score
                            ? passwordStrength.color
                            : 'bg-[color:var(--line)]'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    passwordStrength.score <= 1 ? 'text-red-500' :
                    passwordStrength.score === 2 ? 'text-orange-500' :
                    passwordStrength.score === 3 ? 'text-amber-500' :
                    'text-green-500'
                  }`}>
                    {passwordStrength.label}
                  </p>

                  <div className="mt-2 space-y-1">
                    {[
                      { test: formData.password.length >= 8, text: 'At least 8 characters' },
                      { test: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
                      { test: /[0-9]/.test(formData.password), text: 'One number' },
                      { test: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password), text: 'One special character' },
                    ].map((req) => (
                      <div key={req.text} className="flex items-center gap-2">
                        <FiCheck className={`w-3.5 h-3.5 ${req.test ? 'text-green-500' : 'text-[color:var(--text-3)]'}`} />
                        <span className={`text-xs ${req.test ? 'text-green-500' : 'text-[color:var(--text-3)]'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-start gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAgreeTerms(!agreeTerms)}
                className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 mt-0.5 ${
                  agreeTerms
                    ? 'bg-green-500 border-green-500'
                    : 'border-[color:var(--line)] hover:border-green-400'
                }`}
              >
                {agreeTerms && <FiCheck className="w-3 h-3 text-white" />}
              </button>
              <span className="text-sm text-[color:var(--text-2)]">
                I agree to FreelanceHub&apos;s{' '}
                <Link to="/terms" className="text-[rgb(var(--accent-rgb))] hover:opacity-90 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-[rgb(var(--accent-rgb))] hover:opacity-90 font-medium">
                  Privacy Policy
                </Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="ui-btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mt-6"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <FiArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-l border-[color:var(--line)] bg-[color:var(--bg-soft)]">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full blur-3xl bg-[rgba(var(--accent-rgb),0.18)]" />
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full blur-3xl bg-[rgba(var(--accent-2-rgb),0.16)]" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full blur-3xl bg-[rgba(var(--ok-rgb),0.12)]" />

        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `linear-gradient(to right, color-mix(in srgb, var(--line) 65%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--line) 65%, transparent) 1px, transparent 1px)`,
            backgroundSize: '34px 34px'
          }}
        />

        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
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
              Start your journey as a
              <span className="block text-gradient">
                top freelancer
              </span>
            </h2>

            <p className="text-[color:var(--text-2)] text-lg mb-10 leading-relaxed max-w-md">
              Join thousands of skilled professionals who are earning and growing their careers on FreelanceHub.
            </p>

            <div className="grid grid-cols-3 gap-6">
              {[
                { number: '10K+', label: 'Freelancers' },
                { number: '$2M+', label: 'Paid Out' },
                { number: '4.9★', label: 'Rating' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="text-center p-4 rounded-2xl glass-card"
                >
                  <div className="text-2xl font-bold text-[color:var(--text-1)]">{stat.number}</div>
                  <div className="text-[color:var(--text-2)] text-sm mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;