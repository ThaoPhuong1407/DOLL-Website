const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'a update must have a title'],
    },
    body: { 
      type: String,
      require: [true, 'a update must have a description'],
    },
    dateCreated: { 
      type: Date,
      require: [true, 'a update must have a description'],
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

updateSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

updateSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// Create and export an instance of the update Class
const Update = mongoose.model('update', updateSchema); // model-name, schema-name
module.exports = Update;

