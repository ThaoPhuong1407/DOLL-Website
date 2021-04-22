const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a solution must have a name!'],
    },
    shortDescription: {
      type: String,
      require: [true, 'a solution must have a body'],
    },
    longDescription: {
      type: String,
      require: [true, 'a solution must have a body'],
    },
    image: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

solutionSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

solutionSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// Create and export an instance of the solution Class
const Solution = mongoose.model('solution', solutionSchema); // model-name, schema-name
module.exports = Solution;
