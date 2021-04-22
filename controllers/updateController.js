const Update = require('../models/updateDOLLModel');
const factory = require('./handlerFactory');

exports.createUpdate     = factory.createOne(Update);
exports.updateUpdate    = factory.updateOne(Update);
exports.deleteUpdate    = factory.deleteOne(Update);
exports.getUpdate       = factory.getOne(Update);
exports.getAllUpdates  = factory.getAll(Update);