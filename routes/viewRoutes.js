/* ------------------------------------------ */
/*    CREATE ROUTER OBJECT                    */
/*    Needed to be mounted to an address      */
/* ------------------------------------------ */
const express = require('express');
const viewController = require('../controllers/viewController');
const router = express.Router();

/* -------------- */
/*    ROUTES      */
/* -------------- */
router.get('/', viewController.getHome);
router.get('/about', viewController.getAbout);
router.get('/contact', viewController.getContact);
router.get('/newsandprojects', viewController.getNewsProjects);
router.get('/post/:slug', viewController.getPost);
router.get('/construction', viewController.getConstruction);

// app.get('/post/1', (req, res)=> {
//   res.status(200).render('post1', {
//       test: 'Thao Phuong',
//   });
// });

// app.get('/post/2', (req, res)=> {
//   res.status(200).render('post2', {
//       test: 'Thao Phuong',
//   });
// });

module.exports = router;
