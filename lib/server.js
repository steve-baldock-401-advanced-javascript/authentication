'use strict';

const express = require('express');
const cors = require('cors');
// const bcrypt = require('bcrypt');
// const base64 = require('base-64');
// const jwt = require('jsonwebtoken');
require('dotenv').config();

const notFound = require('../middleware/404.js');
const errorHandler = require('../middlware/500.js');
const router = require('../auth/routes.js');


const app = express();

app.use(cors());

app.use(express.json()); 

// routes
app.use(router);

app.use(notFound);
app.use(errorHandler);


module.exports = {
  start: port => {
    const PORT = port || process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  },
};