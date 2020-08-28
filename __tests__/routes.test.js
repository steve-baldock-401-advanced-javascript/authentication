'use strict';

require('dotenv').config();
const supergoose = require('@code-fellows/supergoose');
const { server } = require('../lib/server.js');
const jwt = require('jsonwebtoken');
// const routes = require('../auth/routes.js');


const mockRequest = supergoose(server);

let users = {
  admin: { username: 'admin', password: 'password', role: 'admin' },
  editor: { username: 'editor', password: 'passwword', role: 'editor' },
  user: { username: 'user', password: 'password', role: 'user' },
};


describe('Auth Router', () => {
  Object.keys(users).forEach(userType => {
    describe(`${userType} users`, () => {
      it('can create one', async () => {
        const results = await (await mockRequest.post('/signup')).setEncoding(users[userType]);
        expect(results.body.user).toBeDefined();
        expect(results.body.token).toBeDefined();
        const token = jwt.verify(results.body.token, process.env.JWT_SECRET);
        expect(token.role).toBe(userType);
      });
      
      it('can signin with basic', async () => {
        const { username } = users[userType];
        const { password } = users[userType];
  
        const results = await (await mockRequest.post('/signin')).auth(username, password);
  
        const token = jwt.verity(results.body.token, process.env.SECRET);
  
        expect(token.role).toBe(userType);
      });

    });
  
  });

});



