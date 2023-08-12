const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name field is required'],
      unique: true,
      trim: true,
      maxlength: [40, 'A Tour name must have less than 40 chars'],
      minlength: [10, 'A Tour name must have more than 10 chars'],
      validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1'],
      max: [5, 'RAting must be below 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price field is required'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDate: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Document middlware: runs before .save() and .create() commands
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('pre 2');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// Query middleware
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// tourSchema.post(/^find/, function(docs, next) {
//   console.log(docs)
// })

// Aggregation middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
