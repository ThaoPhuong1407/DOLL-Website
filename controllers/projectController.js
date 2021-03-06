/* --------------------- */
/*  ROUTE HANDLERS       */
/* --------------------- */
const Project = require('../models/projectModel');
const factory = require('./handlerFactory');

exports.createProject     = factory.createOne(Project);
exports.updateProject    = factory.updateOne(Project);
exports.deleteProject    = factory.deleteOne(Project);
exports.getProject       = factory.getOne(Project);
exports.getAllProjects  = factory.getAll(Project);
