const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { uploadImage, deleteImage } = require('../services/uploadService');

const getMyProfile = catchAsync(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    data: { user }
  });
});



const updateMyProfile = catchAsync(async (req, res, next) => {
 
  const allowedFields = [
    'name', 'username', 'title', 'bio',
    'location', 'socialLinks',
    'freelancerProfile', 'clientProfile',
    'currentRole'
  ];

  const updates = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

 
  if (updates.username) {
    updates.username = updates.username.toLowerCase();
    if (!/^[a-z0-9_]+$/.test(updates.username)) {
      return next(new AppError('Username can only contain lowercase letters, numbers, and underscores', 400));
    }

    const existingUser = await User.findOne({
      username: updates.username,
      _id: { $ne: req.user._id }  
    });

    if (existingUser) {
      return next(new AppError('Username is already taken', 400));
    }
  }
  if (updates.currentRole) {
    const user = req.user;
    if (updates.currentRole === 'freelancer' && !user.roles.includes('freelancer')) {
      updates.roles = [...user.roles, 'freelancer'];
    }

    if (updates.currentRole === 'client' && !user.roles.includes('client')) {
      updates.roles = [...user.roles, 'client'];
    }
  }


  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    {
      new: true,              
      runValidators: true    
    }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully!',
    data: { user }
  });
});


const uploadAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload an image', 400));
  }

  const user = req.user;


  if (user.avatar && user.avatar.publicId) {
    await deleteImage(user.avatar.publicId);
  }


  const result = await uploadImage(req.file.buffer, 'freelancehub/avatars');

  user.avatar = {
    url: result.url,
    publicId: result.publicId
  };
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Avatar uploaded successfully!',
    data: {
      avatar: user.avatar
    }
  });
});


const deleteAvatar = catchAsync(async (req, res) => {
  const user = req.user;


  if (user.avatar && user.avatar.publicId) {
    await deleteImage(user.avatar.publicId);
  }

  user.avatar = { url: '', publicId: '' };
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Avatar removed successfully!'
  });
});


const getPublicProfile = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    username: req.params.username.toLowerCase(),
    status: 'active'
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }


  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        title: user.title,
        bio: user.bio,
        roles: user.roles,
        currentRole: user.currentRole,
        freelancerProfile: user.freelancerProfile,
        location: user.location,
        createdAt: user.createdAt
      }
    }
  });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  uploadAvatar,
  deleteAvatar,
  getPublicProfile
};