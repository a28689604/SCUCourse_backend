const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    _id: { type: String },
    teacherName: {
      type: String,
      required: [true, 'A course must have a name'],
    },
    recommendPercentage: {
      type: Number,
      default: -1,
    },
    difficultyAverage: {
      type: Number,
      default: -1,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  // Make sure that when we have a virtual property, it will also show up whenever there is an output
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// courseSchema.index({ price: 1 });
teacherSchema.index({ scoreAverage: 1 });

teacherSchema.virtual('courses', {
  ref: 'Course',
  // The name of the field in the other model where the reference to the current model is store.
  foreignField: 'teacherId',
  // Where that ID is actually stored here in this current model
  localField: '_id',
});

// teacherSchema.virtual('reviews', {
//   ref: 'Review',
//   // The name of the field in the other model where the reference to the current model is store.
//   foreignField: 'teacher',
//   // Where that ID is actually stored here in this current model
//   localField: '_id',
// });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()

// teacherSchema.pre('save', async function (next) {
//   // IMPORTANT await return promise, so we have to consume promise again
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// teacherSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// teacherSchema.pre('find', function (next) {

// teacherSchema.pre(/^find/, function (next) {
//   // IMPORTANT populate is going to add some extra query
//   this.populate({
//     path: 'guides',
//     // IMPORTANT get rid of the fields we don't want
//     select: '-__v -passwordChangedAt',
//   });
//   next();
// });

// teacherSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);

//   next();
// });

// AGGREGATION MIDDLEWARE
// teacherSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretteacher: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
