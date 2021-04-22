/* ------------------------------------------ */
/*    CREATE ROUTER OBJECT                    */
/*    Needed to be mounted to an address      */
/* ------------------------------------------ */
const express = require('express');
const solutionController = require('../controllers/solutionController');
const router = express.Router();

router
  .route('/')
  .get(solutionController.getAllSolutions)
  .post(solutionController.createSolution);

router
  .route('/:id')
  .get(solutionController.getSolution)
  .patch(solutionController.updateSolution)
  .delete(solutionController.deleteSolution);

module.exports = router;