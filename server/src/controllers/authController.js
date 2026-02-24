const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { generateAccessToken } = require('../utils/jwt');

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

  const user = await User.create({
    name,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password
  });

  const token = generateAccessToken(user._id);

  user.password = undefined;

  res.status(201).json({
    success: true,
    message: 'Account created successfully!',
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
  login,
  getMe
};