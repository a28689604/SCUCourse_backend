const mongoose = require('mongoose');
const Review = require('./reviewModel');

const voteSchema = new mongoose.Schema(
  {
    vote: { type: Boolean, required: [true, 'Vote must have a vote.'] },
    voter: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Vote must belong to a user.'],
    },
    review: {
      type: mongoose.Schema.ObjectId,
      ref: 'Review',
      required: [true, 'Vote must belong to a review.'],
    },
  },
  // Make sure that when we have a virtual property, it will also show up whenever there is an output
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

voteSchema.index({ vote: 1, voter: 1, review: 1 }, { unique: true });

voteSchema.statics.UpDownVoteCount = async function (reviewId) {
  const stats = await this.aggregate([
    {
      $match: { review: reviewId },
    },
    {
      $group: {
        _id: '$review',
        nVote: { $sum: 1 },
        countUpVote: {
          $sum: { $cond: [{ $eq: ['$vote', true] }, 1, 0] },
        },
        countDownVote: {
          $sum: { $cond: [{ $eq: ['$vote', false] }, 1, 0] },
        },
      },
    },
  ]);

  if (stats.length > 0) {
    await Review.findByIdAndUpdate(reviewId, {
      upVotes: stats[0].countUpVote,
      downVotes: stats[0].countDownVote,
      voteCount: stats[0].nVote,
    });
  } else {
    await Review.findByIdAndUpdate(reviewId, {
      upVotes: 0,
      downVotes: 0,
      voteCount: 0,
    });
  }
};

voteSchema.post('save', function () {
  this.constructor.UpDownVoteCount(this.review);
});

// IMPORTANT findByIdAndUpdate & Delete is only the short hand of findOneAnd
voteSchema.pre(/^findOneAnd/, async function (next) {
  // IMPORTANT this keyword here is the current query, so we execute the query right away, to get the current review document
  this.r = await this.findOne();
  next();
});

voteSchema.post(/^findOneAnd/, async function () {
  // IMPORTANT await this.findOne(); does not work here, query has already executed.
  // IMPORTANT using this.r to pass the data from the pre-middleware to the post middleware, and here, we retrived the review document form the this variable

  await this.r.constructor.UpDownVoteCount(this.r.review);

  // IMPORTANT code below actually work
  // const test = await this.findOne();
  // console.log(test);
  // await test.constructor.calcAverageRatings(test.course);
});

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;
