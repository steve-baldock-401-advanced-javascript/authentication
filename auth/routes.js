'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../auth/middleware.js')
const users = require('./users-model.js');
const oauth = require('../middleware/oauth.js');

router.post('/signup', (req, res, next) => {
  // create new user
  // save it
  // add to response -> ???


  const user = new users(req.body);

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

router.post('/signin', auth, (req, res, next) => {
  // response sends back token, user, 
  res.cookie('auth', req.token);
  res.send(req.token);
});

router.get();

router.get('/oauth', oauth, (req, res, next) => {
  // new route to the auth router
});

module.exports = router;



  

  
// Create GET route for /users that returns a JSON object
// get(id) {
//   if (id) {
//     return this.schema.findById(id);
//   }
//   else {
//     return this.schema.find({});
//   }
// }
 
