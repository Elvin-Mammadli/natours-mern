const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => console.log('DB connected.'))
  .catch((err) => console.log('ERROR'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('Server started...');
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!');
  server.close(() => {
    process.exit(1);
  });
});
