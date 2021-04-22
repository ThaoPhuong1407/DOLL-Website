const mongoose = require('mongoose');

const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a person must have a name!'],
    },
    jobTitle: {
      type: String,
      require: [true, 'a person must have a job title'],
    },
    description: { 
      type: String,
      require: [true, 'a person must have a description'],
    },
    image: {
      type: [String],
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

personSchema.index({ title: 1 });

personSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

personSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// Create and export an instance of the person Class
const Person = mongoose.model('Person', personSchema); // model-name, schema-name
module.exports = Person;
