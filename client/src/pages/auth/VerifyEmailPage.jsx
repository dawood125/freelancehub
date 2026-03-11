import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import authService from '../../services/authService';

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || JSON.parse(localStorage.getItem('user') || '{}').email || '';

  
  const inputRefs = useRef([]);

  
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);


  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);


  const handleChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split('');
      pastedCode.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);

      const focusIndex = Math.min(pastedCode.length, 5);
      if (inputRefs.current[focusIndex]) {
        inputRefs.current[focusIndex].focus();
      }
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const otpString = otp.join('');

    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    if (!email) {
      toast.error('Email not found. Please register again.');
      navigate('/register');
      return;
    }

    setIsLoading(true);

    try {
      await authService.verifyEmail({ email, otp: otpString });

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.isEmailVerified = true;
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Email verified successfully! 🎉');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid verification code';
      toast.error(message);
      setOtp(['', '', '', '', '', '']);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || !email) return;

    setIsResending(true);

    try {
      await authService.resendOTP(email);
      toast.success('New verification code sent! 📧');
      setResendTimer(60); 
      setOtp(['', '', '', '', '', '']);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend code';
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Link
          to="/register"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8 group transition-colors duration-300"
        >
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to register
        </Link>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl flex items-center justify-center"
          >
            <FiMail className="w-9 h-9 text-green-600" />
          </motion.div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
              Check your email
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              We sent a verification code to
              <br />
              <span className="font-semibold text-gray-700">{email || 'your email'}</span>
            </p>
          </div>

          <form onSubmit={handleVerify}>
            <div className="flex justify-center gap-3 mb-8">
              {otp.map((digit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                >
                  <input
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={index === 0 ? 6 : 1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 outline-none transition-all duration-300 ${
                      digit
                        ? 'border-green-500 bg-green-50/50 text-green-700'
                        : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 focus:border-green-500 focus:bg-green-50/30'
                    }`}
                  />
                </motion.div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Didn&apos;t receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={resendTimer > 0 || isResending}
              className={`inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 ${
                resendTimer > 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-green-600 hover:text-green-700'
              }`}
            >
              <FiRefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
              {resendTimer > 0
                ? `Resend in ${resendTimer}s`
                : isResending
                ? 'Sending...'
                : 'Resend Code'
              }
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Make sure to check your spam folder if you don&apos;t see the email.
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;