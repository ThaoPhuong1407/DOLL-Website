const Solution = require('../models/solutionModel');
const factory = require('./handlerFactory');

exports.createSolution = factory.createOne(Solution);
exports.updateSolution = factory.updateOne(Solution);
exports.deleteSolution = factory.deleteOne(Solution);
exports.getSolution = factory.getOne(Solution);
exports.getAllSolutions = factory.getAll(Solution);
