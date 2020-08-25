'use strict';

//index wants stuff from server
require('dotenv').config();
const server = require('./lib/server.js');
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/products';

const mongooseOptions = {
  useNewUrlParser:true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(MONGODB_URI, mongooseOptions);


server.start();