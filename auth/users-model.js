'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const SINGLE_USE_TOKENS = false;
const TOKEN_EXPIRE = process.env.TOKEN_EXPIRE || '60m';
const usedTokens = new Set();

const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  email: { type: String },
  fullname: { type: String }, 
  role: { type: String, required: false, default: 'user', enum: ['admin', 'editor', 'writer', 'user'] },
  capabilities: { type: Array, required: true, default: [] },
});

// let db = {};


users.pre('save', async function () {
  if(this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  let role = this.role; // tweak as needed when testing

  if(this.isModified('role')) {
  
    switch(role) {
    case 'admin':
      this.capabilities = ['create', 'read', 'update', 'delete'];
      break;
    case 'editor':
      this.capabilities = ['create', 'read', 'update'];
      break;
    case 'writer':
      this.capabilities = ['create', 'read'];
      break;
    case 'user':
      this.capabilities = ['read'];
      break;
    }
  }
});

// users.save = async function (record) {
//   if(!db[record.username]) {
//     record.password = await bcrypt.hash(record.password, 5);
//     db[record.username] = record;
//     return record;
//   }
  
//   return Promise.reject();
  
// };


users.statics.createFromOauth = async function (username) {
  if(!username) {
    return Promise.reject('Validation Error'); 
  } 
  return this.findOne( { username })
    .then(user => {
      if(!user) { throw new Error('User not found'); }
      console.log('Welcome Back', user.username);
      return user;
    })
    .catch(error => {
      console.log('Creating new user');
      let password = 'digthisvibe';
      let role = 'user'; // change this to test routes
      return this.create({ username, password, role });
    });
};

users.statics.authenticateToken = function (token) {
  if(usedTokens.has(token)) {
    console.log('fail');
    return Promise.reject('Invalid Token');
  }

  try {
    let parsedToken = jwt.verify(token, secret);
    (SINGLE_USE_TOKENS) && parsedToken.type !== 'key' && usedTokens.add(token);

    let query = { _id: parsedToken.id };
    return this.findOne(query);
  } catch (err) { throw new Error('Invalid Token');}
};

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

users.methods.generateToken = function (type) {
  let token = {
    id: this._id,
    role: this.role,
    capabilities: this.capabilities,
  };

  let options = {};
  if(type !== 'key' && !!TOKEN_EXPIRE) {
    options = { expiresIn: TOKEN_EXPIRE };
  }
   
  return jwt.sign(token, secret, options);
};

users.methods.generateKey = function () {
  return this.generateToken('key');
};


module.exports = mongoose.model('users', users);



