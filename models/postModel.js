const mongoose = require('mongoose');
const slugify = require('slugify'); // url-name

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'a post must have a title!'],
    },
    slug: String,
    author: {
      type: String,
      require: [true, 'a ost must be written by an author/writer!'],
    },
    source: {
      type: String,
      require: [true, 'a post must have a source. Example: New York Times, Dynamic Object Language Labs Inc, Washington Post, etc.'],
    },
    dateCreated: {
      type: Date,
      require: [true, 'a post must have a valid date created'],
    },
    body: { 
      type: String,
      require: [true, 'a post must have a body text'],
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

postSchema.index({ title: 1 });

// this keyword refers to the current document
postSchema.pre('save', function (next) {
  this.slug = `${slugify(this.title, { lower: true })}-${this._id}`;
  next();
});

postSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

postSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});


// Create and export an instance of the Post Class
const Post = mongoose.model('Post', postSchema); // model-name, schema-name
module.exports = Post;
