const fs = require('fs');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

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
app.use(morgan('dev'));

// route
fs.readdirSync('./routes').map((r) =>
  app.use('/api/v1', require(`./routes/${r}`))
);

// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
