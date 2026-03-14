const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');

const getAllCategories = catchAsync(async (req, res) => {
  const categories = await Category.find({ parent: null, isActive: true })
    .sort('order')
    .populate({
      path: 'subcategories',
      match: { isActive: true },
      options: { sort: { order: 1 } }
    });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: { categories }
  });
});

const getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id)
    .populate({
      path: 'subcategories',
      match: { isActive: true },
      options: { sort: { order: 1 } }
    });

  if (!category) {
    return next(new (require('../utils/AppError'))('Category not found', 404));
  }

  res.status(200).json({
    success: true,
    data: { category }
  });
});

module.exports = { getAllCategories, getCategory };