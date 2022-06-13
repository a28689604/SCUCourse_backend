const express = require('express');
const courseController = require('../controllers/courseController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// router.param('id', courseController.checkID);

router.use('/:courseId/reviews', reviewRouter);

router
  .route('/')
  .get(courseController.getAllCourses)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    courseController.createCourse
  );

router
  .route('/:id')
  .get(courseController.getCourse)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    courseController.updateCourse
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    courseController.deleteCourse
  );

module.exports = router;
