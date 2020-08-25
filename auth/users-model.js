'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true},
  email: { type: String, required: false},
  fullname: { type: String, required: false}, 
  role: { type: String, required: false, default: 'user', enum: ['admin', 'editor', 'user'] },
});

// modify user instance before saving - only when password is changing
users.pre('save', async function() {
  if(this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

users.statics.authenticateBasic = function (username, password) {
  let query = { username };
  return this.findOne(query)
    .then(user => user && user.comparePassword(password) )
    .catch(console.error);
};

users.methods.comparePassword = function(plainPassword) {
  return bcrypt.compare(plainPassword, this.password)
    .then(valid => valid ? this : null)
    .catch(console.error);
};

// users.methods.generateToken = function () {

// }

let SECRET = 'arrestthecopswhokilledbreonnataylor';

let db = {};

// Because we're using async bcrypt, this function needs to return a value or a promise rejection
users.save = async function (record) {
  if(!db[record.username]) {
    record.password = await bcrypt.hash(record.password, 5);

    db[record.username] = record;

    return record;
  }
  return Promise.reject();
};



// users.list = () => db;



module.exports = mongoose.model('users', users);



