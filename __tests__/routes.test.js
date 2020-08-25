'use strict';

require('@code-fellows/supergoose');

const server = require('../lib/server.js');
const jwt = require('jsonwebtoken');
const supergoose = require('@code-fellows/supergoose');

const mockRequest = supergoose(server);

describe('Auth Router', () => {
  describe('users signup/in', () => {
    it('can sign up', async () => {
      const userData = { username: 'admin', password: 'password', role: 'admin', email: 'admin@admin.com' };

      const results = await (await mockRequest.post('/signup')).setEncoding(userData);

      const token = jwt.verify(results.text, process.env.SECRET);

      expect(token.id).toBeDefined();
    });

    it('can signin with basic', async () => {
      const userData = { username: 'bob', password: 'password', role: 'admin', email: 'admin@admin.com' };

      await (await mockRequest.post('/signup')).send(userData);

      const results = await (await mockRequest.post('/signin')).auth('joey', 'password');

      const token = jwt.verity(results.text, process.env.SECRET);

      expect(token).toBeDefined();
    });

  });

});

