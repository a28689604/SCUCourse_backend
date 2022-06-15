const Teacher = require('../models/teacherModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// upload.single('image');
// upload.array('images', 5);

exports.aliasTopTeachers = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

exports.getAllTeachers = factory.getAll(Teacher);
exports.createTeacher = factory.createOne(Teacher);
exports.updateTeacher = factory.updateOne(Teacher);
exports.deleteTeacher = factory.deleteOne(Teacher);

exports.getTeacher = catchAsync(async (req, res, next) => {
  const query = Teacher.find({ teacherName: req.params.id }).populate({
    path: 'courses',
    populate: {
      path: 'reviews',
      populate: {
        path: 'votes',
      },
    },
  });
  const doc = await query;

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
