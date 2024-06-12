/* ------------------ */
/*    SETUP CODE      */
/* ------------------ */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// When we have uncaught exceptions (synchronous errors), the process object will emit an event named uncaughtException
process.on('uncaughtException', (err) => {
  console.error(
    'Uncaught Exception (synchrous errors) ! 🔥 ... Shutting down ...'
  );
  console.error(err.name, err.message, err.stack);
  process.exit(1); // 0 = success, 1 = error
});

dotenv.config({ path: './config.env' }); // Read variables from this file and store them to nodejs environment.

const app = require('./app'); // This must be declared after dotenv

// DATABSE CONNECTION
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
).replace('<USERNAME>', process.env.DATABASE_USERNAME);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log('DB connection successful');
  });

// SERVER LISTENER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// HANLDERS should be the last results (like a back-up)...
// When we have unhandled rejections (asynchronous errors), the process object will emit an event named unhandledRejection
process.on('unhandledRejection', (err) => {
  console.error(
    'Unhanle rejection (asynchronous errors) ! 🔥 ... Shutting down ...'
  );
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1); // 0 = success, 1 = error
  });
});
