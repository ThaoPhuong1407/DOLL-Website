const Post = require('../models/postModel');
const factory = require('./handlerFactory');

exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);
exports.getPost = factory.getOne(Post);
exports.getAllPosts = factory.getAll(Post);
