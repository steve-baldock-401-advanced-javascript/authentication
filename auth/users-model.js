'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const users = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true},
  email: { type: String },
  fullname: { type: String }, 
  role: { type: String, required: false, default: 'user', enum: ['admin', 'editor', 'user'] },
});

users.pre('save', async function () {
  if(this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// Check if there is a user with that username and password
users.statics.authenticateBasic = async function (username, password) {

  let query = { username };

  const user = await this.findOne(query);
  // first needs to be truthy in order to move on to second and return function below
  return user &&  await user.comparePassword(password);
};

users.methods.comparePassword = async function(plainPassword) {
  const passwordMatch = await bcrypt.compare(plainPassword, this.password);
  return passwordMatch ? this : null;
};

users.methods.generateToken =  async function () {
  const token = {
    id: this._id,
    role: this.role,
  };
   
  return jwt.sign(token, secret);
};

users.statics.createFromOauth = async function (email) {
  if(!email) {
    return Promise.reject('Validation Error'); 
  } 

  const user = await this.findOne({ email });
  if(user) {
    return user;
  } else {
    return this.create({ username: email, password: 'none', email: email });
  }
};

module.exports = mongoose.model('users', users);



