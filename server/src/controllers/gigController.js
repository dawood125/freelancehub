const Gig = require('../models/Gig');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { uploadImage, deleteImage } = require('../services/uploadService');



const createGig = catchAsync(async (req, res, next) => {
  if (!req.user.roles.includes('freelancer') && req.user.currentRole !== 'freelancer') {
    return next(new AppError('Only freelancers can create gigs. Please switch to freelancer role.', 403));
  }

  req.body.seller = req.user._id;

  const gig = await Gig.create(req.body);

  await gig.populate('seller', 'name username avatar freelancerProfile');
  await gig.populate('category', 'name slug');
  await gig.populate('subcategory', 'name slug');

  res.status(201).json({
    success: true,
    message: 'Gig created successfully!',
    data: { gig }
  });
});

const getAllGigs = catchAsync(async (req, res) => {
  const queryObj = { status: 'active' };

  if (req.query.search) {
    queryObj.$text = { $search: req.query.search };
  }


  if (req.query.category) {
    queryObj.category = req.query.category;
  }

  if (req.query.subcategory) {
    queryObj.subcategory = req.query.subcategory;
  }

  if (req.query.minPrice || req.query.maxPrice) {
    queryObj['packages.basic.price'] = {};
    if (req.query.minPrice) {
      queryObj['packages.basic.price'].$gte = Number(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      queryObj['packages.basic.price'].$lte = Number(req.query.maxPrice);
    }
  }

  if (req.query.deliveryTime) {
    queryObj['packages.basic.deliveryDays'] = {
      $lte: Number(req.query.deliveryTime)
    };
  }


  if (req.query.rating) {
    queryObj['ratings.average'] = { $gte: Number(req.query.rating) };
  }

  if (req.query.seller) {
    queryObj.seller = req.query.seller;
  }

  let sortObj = {};
  switch (req.query.sortBy) {
    case 'newest':
      sortObj = { createdAt: -1 };
      break;
    case 'oldest':
      sortObj = { createdAt: 1 };
      break;
    case 'price_low':
      sortObj = { 'packages.basic.price': 1 };
      break;
    case 'price_high':
      sortObj = { 'packages.basic.price': -1 };
      break;
    case 'rating':
      sortObj = { 'ratings.average': -1 };
      break;
    case 'popular':
      sortObj = { 'stats.orders': -1 };
      break;
    default:

      if (req.query.search) {
        sortObj = { score: { $meta: 'textScore' } };
      } else {
        sortObj = { createdAt: -1 };
      }
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const gigsQuery = Gig.find(queryObj)
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .populate('seller', 'name username avatar freelancerProfile')
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug');

  if (req.query.search) {
    gigsQuery.select({ score: { $meta: 'textScore' } });
  }

  const [gigs, total] = await Promise.all([
    gigsQuery,
    Gig.countDocuments(queryObj)
  ]);

  res.status(200).json({
    success: true,
    count: gigs.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: { gigs }
  });
});



const getGig = catchAsync(async (req, res, next) => {
  const gig = await Gig.findById(req.params.id)
    .populate('seller', 'name username avatar title bio freelancerProfile location createdAt')
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug');

  if (!gig) {
    return next(new AppError('Gig not found', 404));
  }

  gig.stats.impressions += 1;
  await gig.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: { gig }
  });
});


const getMyGigs = catchAsync(async (req, res) => {
  const gigs = await Gig.find({
    seller: req.user._id,
    status: { $ne: 'deleted' }
  })
    .sort({ createdAt: -1 })
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug');

  res.status(200).json({
    success: true,
    count: gigs.length,
    data: { gigs }
  });
});



const updateGig = catchAsync(async (req, res, next) => {
  let gig = await Gig.findById(req.params.id);

  if (!gig) {
    return next(new AppError('Gig not found', 404));
  }

 
  if (gig.seller.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only update your own gigs', 403));
  }

  const allowedFields = [
    'title', 'description', 'category', 'subcategory',
    'tags', 'packages', 'faqs', 'requirements', 'status'
  ];

  const updates = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  gig = await Gig.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  })
    .populate('seller', 'name username avatar freelancerProfile')
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug');

  res.status(200).json({
    success: true,
    message: 'Gig updated successfully!',
    data: { gig }
  });
});



const deleteGig = catchAsync(async (req, res, next) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig) {
    return next(new AppError('Gig not found', 404));
  }

  if (gig.seller.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only delete your own gigs', 403));
  }


  gig.status = 'deleted';
  await gig.save({ validateBeforeSave: false });

  for (const image of gig.images) {
    if (image.publicId) {
      await deleteImage(image.publicId);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Gig deleted successfully!'
  });
});



const uploadGigImages = catchAsync(async (req, res, next) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig) {
    return next(new AppError('Gig not found', 404));
  }

  if (gig.seller.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only upload images to your own gigs', 403));
  }

  if (!req.files || req.files.length === 0) {
    return next(new AppError('Please upload at least one image', 400));
  }

  if (gig.images.length + req.files.length > 5) {
    return next(new AppError('Maximum 5 images allowed per gig', 400));
  }

  const uploadedImages = [];

  for (const file of req.files) {
    const result = await uploadImage(file.buffer, 'freelancehub/gigs');
    uploadedImages.push({
      url: result.url,
      publicId: result.publicId,
      isPrimary: gig.images.length === 0 && uploadedImages.length === 0
    });
  }

  gig.images.push(...uploadedImages);
  await gig.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `${uploadedImages.length} image(s) uploaded successfully!`,
    data: { images: gig.images }
  });
});


const deleteGigImage = catchAsync(async (req, res, next) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig) {
    return next(new AppError('Gig not found', 404));
  }

  if (gig.seller.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only delete images from your own gigs', 403));
  }

  const image = gig.images.id(req.params.imageId);

  if (!image) {
    return next(new AppError('Image not found', 404));
  }

  if (image.publicId) {
    await deleteImage(image.publicId);
  }

  gig.images.pull(req.params.imageId);

  if (image.isPrimary && gig.images.length > 0) {
    gig.images[0].isPrimary = true;
  }

  await gig.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Image deleted successfully!',
    data: { images: gig.images }
  });
});

module.exports = {
  createGig,
  getAllGigs,
  getGig,
  getMyGigs,
  updateGig,
  deleteGig,
  uploadGigImages,
  deleteGigImage
};