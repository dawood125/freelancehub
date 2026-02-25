const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { generateAccessToken } = require('../utils/jwt');
const { generateOTP, verifyOTP } = require('../utils/otp');
const { sendVerificationEmail } = require('../services/emailService');


const register = catchAsync(async (req, res, next) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return next(new AppError('Please provide all required fields', 400));
  }

  const existingEmail = await User.findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    return next(new AppError('Email is already registered', 400));
  }

  const existingUsername = await User.findOne({ username: username.toLowerCase() });
  if (existingUsername) {
    return next(new AppError('Username is already taken', 400));
  }


  const { otp, hashedOTP, expiresAt } = generateOTP();

  const user = await User.create({
    name,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    emailVerificationOTP: hashedOTP,       
    emailVerificationExpires: expiresAt    
  });


  try {
    await sendVerificationEmail(user.email, user.name, otp);
  } catch (emailError) {
    console.error('❌ Email sending failed:', emailError.message);
  }

  const token = generateAccessToken(user._id);

  user.password = undefined;
  user.emailVerificationOTP = undefined;
  user.emailVerificationExpires = undefined;

  res.status(201).json({
    success: true,
    message: 'Account created! Please check your email for verification code.',
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        roles: user.roles,
        currentRole: user.currentRole,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt
      }
    }
  });
});


const verifyEmail = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new AppError('Please provide email and OTP', 400));
  }


  const user = await User.findOne({ email: email.toLowerCase() })
    .select('+emailVerificationOTP +emailVerificationExpires');

  if (!user) {
    return next(new AppError('No account found with this email', 404));
  }


  if (user.isEmailVerified) {
    return next(new AppError('Email is already verified', 400));
  }


  if (!user.emailVerificationOTP) {
    return next(new AppError('No verification code found. Please request a new one.', 400));
  }

  if (user.emailVerificationExpires < Date.now()) {
    user.emailVerificationOTP = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('Verification code has expired. Please request a new one.', 400));
  }

 
  const isValidOTP = verifyOTP(otp, user.emailVerificationOTP);

  if (!isValidOTP) {
    return next(new AppError('Invalid verification code', 400));
  }

  user.isEmailVerified = true;
  user.emailVerificationOTP = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Email verified successfully! 🎉'
  });
});


const resendOTP = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Please provide your email', 400));
  }
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return next(new AppError('No account found with this email', 404));
  }

  if (user.isEmailVerified) {
    return next(new AppError('Email is already verified', 400));
  }

  const { otp, hashedOTP, expiresAt } = generateOTP();

  user.emailVerificationOTP = hashedOTP;
  user.emailVerificationExpires = expiresAt;
  await user.save({ validateBeforeSave: false });

  try {
    await sendVerificationEmail(user.email, user.name, otp);
  } catch (emailError) {
    console.error('❌ Email sending failed:', emailError.message);
    return next(new AppError('Failed to send verification email. Please try again.', 500));
  }

  res.status(200).json({
    success: true,
    message: 'New verification code sent to your email!'
  });
});



const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  if (user.status !== 'active') {
    return next(new AppError('Your account has been suspended. Please contact support.', 403));
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = generateAccessToken(user._id);

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  user.password = undefined;

  res.status(200).json({
    success: true,
    message: 'Login successful!',
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        title: user.title,
        bio: user.bio,
        roles: user.roles,
        currentRole: user.currentRole,
        isEmailVerified: user.isEmailVerified,
        freelancerProfile: user.freelancerProfile,
        location: user.location,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    }
  });
});

const getMe = catchAsync(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        title: user.title,
        bio: user.bio,
        roles: user.roles,
        currentRole: user.currentRole,
        isEmailVerified: user.isEmailVerified,
        freelancerProfile: user.freelancerProfile,
        location: user.location,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    }
  });
});

module.exports = {
  register,
  verifyEmail,
  resendOTP,
  login,
  getMe
};