/* ------------------------------------------ */
/*    CREATE ROUTER OBJECT                    */
/*    Needed to be mounted to an address      */
/* ------------------------------------------ */
const express = require('express');
const updateController = require('../controllers/updateController');
const router = express.Router();

router
  .route('/')
  .get(updateController.getAllUpdates)
  .post(updateController.createUpdate);

router
  .route('/:id')
  .get(updateController.getUpdate)
  .patch(updateController.updateUpdate)
  .delete(updateController.deleteUpdate);

module.exports = router;