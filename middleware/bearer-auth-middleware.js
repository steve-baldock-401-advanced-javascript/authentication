'use strict';

const User = require('../auth/users-model.js');

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { next('Invalid Login'); return; }

  let token = req.headers.authorization.split(' ').pop();

  try {

    const validUser = await User.authenticateToken(token);

    req.user = validUser;

    req.user = {
      username: validUser.username,
      fullname: validUser.fullname,
      email: validUser.email,
      capabilities: validUser.capabilities,
    };

    next();
  } catch(err) {
    next('Invalid Login');
  }
};