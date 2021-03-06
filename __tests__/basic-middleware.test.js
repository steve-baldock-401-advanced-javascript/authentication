'use strict';

require('dotenv').config();
require('@code-fellows/supergoose');
const auth = require('../middleware/basic-middleware.js');
const Users = require('../auth/users-model.js');
// const secret = process.env.JWT_SECRET;


beforeEach(async (done) => {
  await new Users({ username: 'admin', password: 'password', role: 'admin', email: 'admin@admin.com' }).save();
  done();
});

afterEach(async () => {
  await Users.deleteMany({});
});

describe('user authentication', () => {
  let errorObject = {'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage': 'Unauthorized'};


    
  // let cachedToken;

  it('it fails a login for a user (admin) with the incorrect basic credentials', async () => {

    let req = {
      headers: {
        authorization: 'Basic YWRtaW46Zm9v',
      },
    };

    let res = {};
    let next = jest.fn(); // stub - ask what happens with usage of next function

    await auth(req, res, next);
    expect(next).toHaveBeenCalledWith(errorObject);

  });

  it('failes a login for a user (admin) wth missing credentials', async () => {
    let req = {
      headers: {},
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
