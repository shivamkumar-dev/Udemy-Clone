const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();
const errorHandler = require('./middlewares/error');

const csrfProtection = csrf({ cookie: true });

// create express app
const app = express();

// routes
const routes = require('./routes');

// DB
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('DB Connection Successful.'))
  .catch((err) => console.log('DB COnnection Err => ', err));

// apply middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// mount routes
app.get('/', (req, res, next) => {
  res.send('Welcome to Edemy');
});

app.use('/api/v1', routes);

app.use(csrfProtection);

app.get('/api/v1/csrf-token', (req, res, next) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Error handler
app.use(errorHandler);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
