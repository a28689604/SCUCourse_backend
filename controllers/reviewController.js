const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.setTeacherUserIds = (req, res, next) => {
  // Allow nested routes

  // IMPORTANT need fix
  if (!req.body.course) req.body.course = req.params.courseId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReivews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);

exports.upvoteReview = catchAsync(async (req, res, next) => {
  const doc = await Review.findByIdAndUpdate(
    req.params.id,
    { $inc: { upvotes: 1 }, $push: { voters: req.user.id } },
    {
      new: true,
    }
  );

  if (!doc) {
    return next(new AppError('No doc found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});
exports.downvoteReview = catchAsync(async (req, res, next) => {
  const doc = await Review.findByIdAndUpdate(
    req.params.id,
    { $inc: { downvotes: 1 }, $push: { voters: req.user.id } },
    {
      new: true,
    }
  );

  if (!doc) {
    return next(new AppError('No doc found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.deleteReview = factory.deleteOne(Review);
