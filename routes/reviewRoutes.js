const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.route('/').get(reviewController.getAllReivews);

router
  .route('/')
  .post(
    authController.protect,
    reviewController.setTeacherUserIds,
    reviewController.createReview
  );

router.route('/:id').get(reviewController.getReview);
// IMPORTANT need to check is owner or not
router
  .route('/:id')
  .patch(
    authController.protect,
    reviewController.isOwner,
    reviewController.updateReview
  )
  .delete(
    authController.protect,
    reviewController.isOwner,
    reviewController.deleteReview
  );

router
  .route('/:id/upvote/:condition')
  .patch(authController.protect, reviewController.upVoteReview);
router
  .route('/:id/downvote/:condition')
  .patch(authController.protect, reviewController.downVoteReview);

module.exports = router;
