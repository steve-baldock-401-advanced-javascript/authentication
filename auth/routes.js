'use strict';

const express = require('express');
const router = express.Router();
const basicAuth = require('../middleware/basic-middleware.js');
const User = require('./users-model.js');
const oauth = require('../middleware/oauth-middleware.js');
const bearerAuth = require('../middleware/bearer-auth-middleware.js');

// This needs to accept either JSON for FORM data with username and password keys. Does it?
router.post('/signup', async (req, res, next) => {
  
  const user = await User.create(req.body);

  user.save()
    .then(user => {
      let token = user.generateToken(user);
      res.status(200).send(token);
    })
    .catch(err => {
      console.error(err);
      res.status(403).send('Error Creating User');
    });
});

router.post('/signin', basicAuth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.set(req.token);

  res.send( {
    token: req.token,
    user: req.user,
  });
});

router.get('/oauth', oauth, (req, res) => {
  res.status(200).send(req.token);
});

router.get('/users', bearerAuth, (req, res) => {
  res.status(200).json(req.user);
});



module.exports = router;
 
