'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../auth/middleware.js')
const User = require('./users-model.js');
const oauth = require('../middleware/oauth.js');

router.post('/signup', async (req, res, next) => {
  // create new user
  // save it
  // add to response -> ???


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

router.post('/signin', auth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.set(req.token);

  res.send( {
    token: req.token,
    user: req.user,
  });
});


router.get('/oauth', oauth, (req, res, next) => {
  res.status(200).send(req.token);
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
 
