'use strict';

const express = require('express');
const router = express.Router();
const permissions = require('../middleware/authorize.js');
const bearerAuth = require('../middleware/bearer-auth-middleware.js');


// router.get('/secret', bearerAuth, (req, res) => {
//   res.status(200).send('Go Forth And Access');
// });

router.get('/public', routeHandler);
router.get('/private', bearerAuth, routeHandler);
router.get('/read', bearerAuth, permissions('read'), routeHandler);
router.post('/add', bearerAuth, permissions('create'), routeHandler);
router.put('/change', bearerAuth, permissions('update'), routeHandler);
router.delete('/remove', bearerAuth, permissions('delete'), routeHandler);

function routeHandler(req, res) {
  res.status(200).send('Access Granted');
}

module.exports = router;

