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
// Workshop routes
router.get('/iwssl-2024', (req, res) => {
  res.redirect(301, '/post/iwssl-workshop-661d4a05ed1f7c00144f54ec');
});
router.get('/iwssl-2025', (req, res) => {
  res.redirect(
    301,
    '/post/the-fifth-international-workshop-on-situated-self-guided-learning-(iwssl-2025)-6823998f4309ec0a18d09122'
  );
});
router.get('/IWSSL-2021', viewController.getWorkshop);

router.use(authController.isLoggedIn);
router.get('/', viewController.getHome);
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
