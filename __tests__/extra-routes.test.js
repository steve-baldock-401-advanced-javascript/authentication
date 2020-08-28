'use strict';

require('dotenv').config();

const { server } = require('../lib/server.js');
const supergoose = require('@code-fellows/supergoose');
const extraRoutes = require('../auth/extra-routes.js');
const mockRequest = supergoose(server);

// How do I make use of my extra-routes for testing purposes?
it ('should allow entry with good token', async () => {
  const response = await mockRequest.get('/secret').auth(process.env.TEST_TOKEN, { type: 'bearer'});
  expect(response.status).toBe(200);
})