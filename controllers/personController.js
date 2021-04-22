const Person = require('../models/personModel');
const factory = require('./handlerFactory');

exports.createPerson = factory.createOne(Person);
exports.updatePerson = factory.updateOne(Person);
exports.deletePerson = factory.deleteOne(Person);
exports.getPerson = factory.getOne(Person);
exports.getAllPeople = factory.getAll(Person);
