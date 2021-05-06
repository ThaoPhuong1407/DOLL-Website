/* ------------------------------------------ */
/*    CREATE ROUTER OBJECT                    */
/*    Needed to be mounted to an address      */
/* ------------------------------------------ */
const express = require('express');
const personController = require('../controllers/personController');
const authController = require('../controllers/authController');
const router = express.Router();

router.use(authController.protect);
router
  .route('/')
  .get(personController.getAllPeople)
  .post(personController.createPerson);

router
  .route('/:id')
  .get(personController.getPerson)
  .patch(personController.updatePerson)
  .delete(personController.deletePerson);

module.exports = router;