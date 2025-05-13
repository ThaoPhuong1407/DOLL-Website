const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Error related
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Routes related
const viewRouter = require('./routes/viewRoutes');
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const projectRouter = require('./routes/projectRoutes');
const personRouter = require('./routes/personRoutes');
const updateRouter = require('./routes/updateRoutes');
const solutionRouter = require('./routes/solutionRoutes');

const app = express();

// ideally, all request info should be in the req, but express doesn't do that ==> we need a middleware: express.json()
app.use(express.json()); // parse data from body
app.use(cookieParser()); // parse data from cookie
app.set('view engine', 'pug'); // Express framework supports pug template
app.set('views', path.join(__dirname, 'views')); // view engine is called "views" in Express. Set "views" to path ./views
app.use(express.static(path.join(__dirname, 'public/'))); // Serving static files from the public folders

// Middleware for debugging purposes
app.use((req, res, next) => {
  next();
});

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// CORS
const allowedOrigins = [
  'http://www.dollabs.com',
  'https://www.dollabs.com',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Handle preflight requests
app.options('*', cors());

/* -------------- */
/*    ROUTES      */
/* -------------- */
// Alias for IWSSL workshop

app.use('/', viewRouter); // templates
app.use('/api/users', userRouter);
app.use('/api/post', postRouter);
app.use('/api/project', projectRouter);
app.use('/api/person', personRouter);
app.use('/api/update', updateRouter);
app.use('/api/solution', solutionRouter);

// all = for all routes: post, get, etc.
app.all('*', (req, res, next) => {
  const message = `Can't find ${req.originalUrl} on this server!`;
  const err = new AppError(message, 404);
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
