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
  const doc = await Teacher.findOne({ teacherName: req.params.id }).populate({
    path: 'courses',
    populate: {
      path: 'reviews',
      populate: {
        path: 'votes',
      },
    },
  });

  if (!doc) {
    return next(new AppError('查無教授。', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});
exports.searchTeacher = catchAsync(async (req, res, next) => {
  const doc = await Teacher.find({
    teacherName: { $regex: req.params.id, $options: 'i' },
  }).sort({ ratingsQuantity: -1 });

  if (doc.length === 0) {
    return next(new AppError('查無教授。', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});
