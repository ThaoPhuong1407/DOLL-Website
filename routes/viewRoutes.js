/* ------------------------------------------ */
/*    CREATE ROUTER OBJECT                    */
/*    Needed to be mounted to an address      */
/* ------------------------------------------ */
const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const router = express.Router();

/* -------------- */
/*    ROUTES      */
/* -------------- */
router.use(authController.isLoggedIn);
router.get('/', viewController.getHome);
router.get('/IWSSL-2021', viewController.getWorkshop);
router.get('/about', viewController.getAbout);
router.get('/contact', viewController.getContact);
router.get('/newsandprojects', viewController.getNewsProjects);
router.get('/post/:slug', viewController.getPost);
router.get('/project/:slug', viewController.getProject);
router.get('/construction', viewController.getConstruction);

// Updating data
router.get('/login', viewController.getLoginForm);
router.get('/input/:type', viewController.getInputForm);


module.exports = router;
