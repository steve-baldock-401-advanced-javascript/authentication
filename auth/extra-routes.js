'use strict';

const express = require('express');
const router = express.Router();
const bearerAuth = require('../middleware/bearer-auth-middleware.js');



router.get('/secret', bearerAuth, (req, res) => {
  res.status(200).send('Go Forth And Access');
});

module.exports = router;

