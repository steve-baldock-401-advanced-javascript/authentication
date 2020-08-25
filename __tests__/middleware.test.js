'use strict';

require('@code-fellows/supergoose');
const auth = require('../auth/middleware.js');
const Users = require('../auth/users-model.js');
process.env.SECRET = 'arrestthecopswhokilledbreonnataylor';


beforeAll(async (done) => {
  await new Users({ username: 'admin', password: 'password', role: 'admin', email: 'admin@admin.com' }).save();
  done();
});

describe('Auth Middleware', () => {
  let errorObject = {'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage': 'Unauthorized'};

  describe('user authentication', () => {
    
    // let cachedToken;

    it('it fails a login for a user (admin) with the incorrect basic credentials', async () => {

      let req = {
        headers: {
          authorization: 'Basic YWRtaW46Zm9v',
        },
      };

      let res = {};
      let next = jest.fn();

      await auth(req, res, next);
      expect(next).toHaveBeenCalledWith(errorObject);

    });

    it('logs in an admin user with the right credentials', async () => {

      let req = {
        headers: {
          authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
        },
      };
      let res  = {};
      let next = jest.fn();

      await auth(req,res,next);

      expect(next).toHaveBeenCalledWith();
    });

  });

});