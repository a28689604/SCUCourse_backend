// review / rating / createAt /ref to tour / ref to user
const mongoose = require('mongoose');
const Teacher = require('./teacherModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    difficulty: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Difficulty can not be empty!'],
    },
    recommend: {
      type: Boolean,
      required: [true, 'Recommend can not be empty!'],
    },
    upVotes: {
      type: Number,
      default: 0,
    },
    downVotes: {
      type: Number,
      default: 0,
    },
    voteCount: {
      type: Number,
      default: 0,
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
      required: [true, 'Review must belong to a course.'],
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: 'Teacher',
      required: [true, 'Review must belong to a teacher.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ teacher: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'course',
    select: 'courseName syear smester department',
  }).populate({
    path: 'teacher',
    select: 'teacherName',
  });
  next();
});

reviewSchema.virtual('votes', {
  ref: 'Vote',
  foreignField: 'review',
  localField: '_id',
});

reviewSchema.statics.difficultyAverageAndRecommend = async function (
  teacherId
) {
  const stats = await this.aggregate([
    {
      $match: { teacher: teacherId },
    },
    {
      $group: {
        _id: '$teacher',
        nRating: { $sum: 1 },
        avgDifficulty: { $avg: '$difficulty' },
        countRecommend: {
          $sum: { $cond: [{ $eq: ['$recommend', true] }, 1, 0] },
        },
      },
    },
  ]);

  if (stats.length > 0) {
    await Teacher.findByIdAndUpdate(teacherId, {
      ratingsQuantity: stats[0].nRating,
      difficultyAverage: stats[0].avgDifficulty,
      recommendPercentage: stats[0].countRecommend / stats[0].nRating,
    });
  } else {
    await Teacher.findByIdAndUpdate(teacherId, {
      ratingsQuantity: 0,
      difficultyAverage: -1,
      recommendPercentage: -1,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.difficultyAverageAndRecommend(this.teacher);
  console.log(this, this.teacher);
});

// IMPORTANT findByIdAndUpdate & Delete is only the short hand of findOneAnd
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // IMPORTANT this keyword here is the current query, so we execute the query right away, to get the current review document
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // IMPORTANT await this.findOne(); does not work here, query has already executed.
  // IMPORTANT using this.r to pass the data from the pre-middleware to the post middleware, and here, we retrived the review document form the this variable

  const teacherObjectId = mongoose.Types.ObjectId(this.r.teacher.id);
  await this.r.constructor.difficultyAverageAndRecommend(teacherObjectId);

  // IMPORTANT code below actually work
  // const test = await this.findOne();
  // console.log(test);
  // await test.constructor.calcAverageRatings(test.course);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
