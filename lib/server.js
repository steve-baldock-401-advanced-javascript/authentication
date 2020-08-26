'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config();

const notFound = require('../middleware/404.js');
const errorHandler = require('../middleware/500.js');
const router = require('../auth/routes.js');


const app = express();

// Helper middleware
app.use(cors());
app.use(morgan('dev'));

app.use(express.status('./public'));
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