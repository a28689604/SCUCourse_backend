const express = require('express');
const teacherController = require('../controllers/teacherController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.param('id', tourController.checkID);

router
  .route('/top-5-recommend')
  .get(teacherController.aliasTopTeachers, teacherController.getAllTeachers);

router
  .route('/')
  .get(teacherController.getAllTeachers)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    teacherController.createTeacher
  );

router.route('/find/:id').get(teacherController.searchTeacher);

router
  .route('/:id')
  .get(teacherController.getTeacher)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    teacherController.updateTeacher
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    teacherController.deleteTeacher
  );

module.exports = router;
