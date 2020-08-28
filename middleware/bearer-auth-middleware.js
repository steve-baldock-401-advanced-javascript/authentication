'use strict';

const users = require('../auth/users-model.js');

module.exports = (req, res, next) => {

  if (!req.headers.authorization) { next('Invalid Login'); return; }

  let token = req.headers.authorization.split(' ').pop();

  users.authenticationToken(token)
    .then(validUser => {
      req.user = validUser;
      next();
    })
    .catch(err => next('Invalid Login'));
};