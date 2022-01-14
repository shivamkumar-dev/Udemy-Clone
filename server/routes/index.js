const express = require('express');
const users = require('./auth');
const router = express.Router();

router.use('/auth', users);

module.exports = router;
