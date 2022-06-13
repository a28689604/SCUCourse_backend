const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.route('/').get(reviewController.getAllReivews);

router.route('/:id').get(reviewController.getReview);

router
  .route('/')
  .post(
    authController.protect,
    reviewController.setTeacherUserIds,
    reviewController.createReview
  );

// IMPORTANT need to check is owner or not
router
  .route('/:id')
  .patch(authController.protect, reviewController.updateReview)
  .delete(authController.protect, reviewController.deleteReview);

// router
//   .route('/:id/upvote')
//   .patch(reviewController.checkIsVotedOrNot, reviewController.upvoteReview);
// router
//   .route('/:id/downvote')
//   .patch(reviewController.checkIsVotedOrNot, reviewController.downvoteReview);

module.exports = router;
