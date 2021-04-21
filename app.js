const express   = require('express');
const path      = require('path');
const morgan = require('morgan');

// Error related
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Routes related 
const viewRouter = require('./routes/viewRoutes');
const postRouter = require('./routes/postRoutes');
const projectRouter = require('./routes/projectRoutes');


const app = express();

//  Setting up pug templates
// ideally, all request info should be in the req, but express doesn't do that ==> we need a middleware: express.json()
app.use(express.json({ limit: '10kb' })); // Need this for POST request
app.set('view engine', 'pug'); // Express framework supports pug template
app.set('views', path.join(__dirname, 'views')); // view engine is called "views" in Express. Set "views" to path ./views
app.use(express.static(path.join(__dirname, 'public/'))); // Serving static files from the public folders

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/* -------------- */
/*    ROUTES      */
/* -------------- */
app.use('/', viewRouter); // templates
app.use('/api/post', postRouter); 
app.use('/api/project', projectRouter); 

// all = for all routes: post, get, etc.
app.all('*', (req, res, next) => {
  const message = `Can't find ${req.originalUrl} on this server!`;
  const err = new AppError(message, 404);
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;


