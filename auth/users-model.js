'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

const users = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true},
  email: { type: String, required: false},
  fullname: { type: String, required: false}, 
  role: { type: String, required: false, default: 'user', enum: ['admin', 'editor', 'user'] },
});


users.statics.authenticateBasic = async function (username, password) {

  let query = { username };

  const user = await this.findOne(query);
  return user && await user.comparePassword(password);
};

users.methods.comparePassword = async function(plainPassword) {
  const valid = await bcrypt.compare(plainPassword, this.password);
  return valid ? this : null;
};

users.methods.generateToken = function () {
  let token = {
    id: this._id,
    role: this.role,
  };
  return jwt.sign(token, secret );
};

users.statics.createFromOauth = function (email) {
  if(!email) {
    return Promise.reject('Validation Error'); 
  } 
  return this.findOne({ email })
    .then(user => {
      if (!user) { throw new Error('User Not Found'); }
      console.log('Welcome Back', user.username);
      return user;
    })
    .catch(error => {
      console.log('Creating new user');
      let username = email;
      let password = 'none';
      return this.create({ username, password, email });
    });
};





module.exports = mongoose.model('users', users);



