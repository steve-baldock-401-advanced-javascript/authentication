'use strict';

//index wants stuff from server
require('dotenv').config();
const server = require('./lib/server.js');
const mongoose = require('mongoose');
const mongodb_uri = process.env.MONGODB_URI;

const mongooseOptions = {
  useNewUrlParser:true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(mongodb_uri, mongooseOptions);

server.start();