const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const Course = require('../models/courseModel');
const Vote = require('../models/voteModel');

exports.setTeacherUserIds = catchAsync(async (req, res, next) => {
  // Allow nested routes

  if (!req.body.course) req.body.course = req.params.courseId;
  if (!req.body.teacher) {
    const courseData = await Course.findById(req.params.courseId);
    req.body.teacher = courseData.teacherIdString;
  }

  if (!req.body.user) req.body.user = req.user.id;
  next();
});

exports.getAllReivews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);

exports.upVoteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  const vote = await Vote.findOne({
    voter: req.user.id,
    review: req.params.id,
  });
  // const { upVoters, downVoters } = review;
  const { condition } = req.params;

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  if (condition === 'true' && !vote) {
    await Vote.create({
      vote: true,
      voter: req.user.id,
      review: req.params.id,
    });
  } else if (condition === 'true' && vote) {
    await Vote.findOneAndUpdate(
      {
        voter: req.user.id,
        review: req.params.id,
      },
      { $set: { vote: true } }
    );
  } else if (condition === 'false' && vote) {
    await Vote.findOneAndDelete({
      vote: true,
      voter: req.user.id,
      review: req.params.id,
    });
  } else {
    return next(new AppError('不允許的操作', 405));
  }

  res.status(204).json({
    status: 'success',
    data: {
      data: review,
    },
  });
});

exports.downVoteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  const vote = await Vote.findOne({
    voter: req.user.id,
    review: req.params.id,
  });
  // const { upVoters, downVoters } = review;
  const { condition } = req.params;

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  if (condition === 'true' && !vote) {
    await Vote.create({
      vote: false,
      voter: req.user.id,
      review: req.params.id,
    });
  } else if (condition === 'true' && vote) {
    await Vote.findOneAndUpdate(
      {
        voter: req.user.id,
        review: req.params.id,
      },
      { $set: { vote: false } }
    );
  } else if (condition === 'false' && vote) {
    await Vote.findOneAndDelete({
      vote: false,
      voter: req.user.id,
      review: req.params.id,
    });
  } else {
    return next(new AppError('不允許的操作', 405));
  }

  // user downVote & user not in downVoters
  // if (
  //   condition === 'true' &&
  //   !downVoters.includes(req.user.id) &&
  //   !upVoters.includes(req.user.id)
  // ) {
  //   review = await Review.findByIdAndUpdate(req.params.id, {
  //     $inc: { downVotes: 1 },
  //     $push: { downVoters: req.user.id },
  //   });
  //   // user downVote  & user in downVoters & user already upVote
  // } else if (
  //   condition === 'true' &&
  //   !downVoters.includes(req.user.id) &&
  //   upVoters.includes(req.user.id)
  // ) {
  //   review = await Review.findByIdAndUpdate(req.params.id, {
  //     $inc: { downVotes: 1, upVotes: -1 },
  //     $push: { downVoters: req.user.id },
  //     $pull: { upVoters: req.user.id },
  //   });

  //   // user withdraw downVote (False) & user in downVoters
  // } else if (
  //   condition === 'false' &&
  //   downVoters.includes(req.user.id) &&
  //   !upVoters.includes(req.user.id)
  // ) {
  //   review = await Review.findByIdAndUpdate(req.params.id, {
  //     $inc: { downVotes: -1 },
  //     $pull: { downVoters: req.user.id },
  //   });
  // } else {
  //   return next(new AppError('不允許的操作', 405));
  // }

  // console.log('upVotes', review.upVotes, 'downVotes', review.downVotes);

  res.status(204).json({
    status: 'success',
    data: {
      data: review,
    },
  });
});

exports.isOwner = factory.isOwner(Review, 'user');

exports.deleteReview = factory.deleteOne(Review);
