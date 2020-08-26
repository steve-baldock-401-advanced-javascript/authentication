'use strict';

const base64 = require('base-64');

const users = require('./users-model.js');

module.exports = async (req, res, next) => {

  //req.headers.authorization should be : "Basic sdkjdsljd="

  if(!req.headers.authorization) { 
    next('Invalid Login'); 
    return; 
  }

  // Pull out just the encoded part by splitting the header into an array on the space and popping off the 2nd element

  let encodedPair = req.headers.authorization.split(' ').pop();


  // decodes to user:pass and splits into an array
  const decoded = base64.decode(encodedPair);
  let [user,pass]  = decoded.split(':'); // user = 'someuser', pass = 'somepass'

  // Is this user okay?
  try {
    const validUser = await users.authenticateBasic(user, pass);

    req.token = users.validUser.generateToken(validUser);
    req.user = user;
    next();
  } catch (err) {
    next({
      'message': 'Invalid Authorzation Headers',
      'status': 401,
      'statusMessage':'Unauthorized',
    });

  }

};
 