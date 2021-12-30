const fs = require('fs');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

const csrfProtection = csrf({ cookie: true });

// create express app
const app = express();

// DB
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('DB Connection Successful..'))
  .catch((err) => console.log('DB COnnection Err => ', err));

// apply middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// route
app.get('/', (req, res, next) => {
  res.send('Welcome to Edemy');
});

fs.readdirSync('./routes').map((r) =>
  app.use('/api/v1', require(`./routes/${r}`))
);

app.use(csrfProtection);

app.get('/api/v1/csrf-token', (req, res, next) => {
  res.json({ csrfToken: req.csrfToken() });
});

// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
