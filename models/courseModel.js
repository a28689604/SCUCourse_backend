const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    _id: { type: String },
    courseName: {
      type: String,
      required: [true, 'A course must have a name'],
    },
    department: {
      type: String,
      required: [true, 'A course must have a department'],
    },
    syear: {
      type: String,
      required: [true, 'A course must have a syear'],
    },
    smester: {
      type: String,
      required: [true, 'A course must have a smester'],
    },
    teacher: {
      type: String,
      required: [true, 'A course must have a teacher'],
    },
    studentNumber: { type: Number, default: -1 },
    finalStudentNumber: { type: Number, default: -1 },
    zero: { type: Number, default: -1 },
    fifty: { type: Number, default: -1 },
    sixty: { type: Number, default: -1 },
    sixtyFive: { type: Number, default: -1 },
    seventy: { type: Number, default: -1 },
    seventyFive: { type: Number, default: -1 },
    eighty: { type: Number, default: -1 },
    eightyFive: { type: Number, default: -1 },
    ninety: { type: Number, default: -1 },
    ninetyFive: { type: Number, default: -1 },
    scoreAverage: { type: Number, default: -1 },
    teacherIdString: {
      type: String,
    },
    teacherId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Teacher',
      required: [true, 'Course must belong to a teacher.'],
    },
    courseUniqueCode: {
      type: String,
      required: [true, 'A course must have a name'],
      trim: true,
    },
    scoreUploadBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  // Make sure that when we have a virtual property, it will also show up whenever there is an output
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// courseSchema.index({ price: 1 });
courseSchema.index({ scoreAverage: 1 });

courseSchema.virtual('coursePopularity').get(function () {
  return this.finalStudentNumber / this.studentNumber;
});

courseSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'course',
  localField: '_id',
});

// courseSchema.virtual('reviews', {
//   ref: 'Review',
//   // The name of the field in the other model where the reference to the current model is store.
//   foreignField: 'course',
//   // Where that ID is actually stored here in this current model
//   localField: '_id',
// });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()

// courseSchema.pre('save', async function (next) {
//   // IMPORTANT await return promise, so we have to consume promise again
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// courseSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// courseSchema.pre('find', function (next) {

// courseSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);

//   next();
// });

// AGGREGATION MIDDLEWARE
// courseSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretcourse: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
