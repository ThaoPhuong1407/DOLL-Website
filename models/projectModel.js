const mongoose = require('mongoose');
const slugify = require('slugify'); // url-name

// Mongoose use native javascript datatype
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A project must have a name'],
      unique: true,
    },
    icon: String,
    slug: String,
    shortDescription: { 
      type: String
    },
    startDate: {
      type: Date,
      require: [true, 'a project must have a start date'],
    },
    endDate: {
      type: Date,
    },
    body: { 
      type: String,
      require: [true, 'a post must have a body text'],
    },
    // image: {
    //   type: [String],
    // },
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

// this keyword refers to the current document
projectSchema.pre('save', function (next) {
  this.slug = `${slugify(this.name, { lower: true })}-${this._id}`;
  next();
});

projectSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

projectSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// 5. Create and export an instance 
const Project = mongoose.model('project', projectSchema); // model-name, schema-name
module.exports = Project;

