const Course = require('../models/courseModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllCourses = factory.getAll(Course);
exports.getCourse = factory.getOne(Course);
exports.createCourse = factory.createOne(Course);
exports.updateCourse = catchAsync(async (req, res, next) => {
  const doc = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new AppError('查無此課程', 404));
  }

  res.status(200).json({
    status: 'success',
    // data: {
    //   data: doc,
    // },
  });
});
exports.deleteCourse = factory.deleteOne(Course);
