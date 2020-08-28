'use strict';

require('dotenv').config();
require('@code-fellows/supergoose');
const jwt = require('jsonwebtoken');
const User = require('../auth/users-model.js');

afterEach(async () => {
  await User.deleteMany({});
});

const fakeUser = {
  username: 'johndenver',
  password: 'password',
  role: 'admin',
  email: 'bob@admin.com',
};

it('should save hashed password', async () => {
  const user = await new User(fakeUser).save();
  expect(user.username).toBe(fakeUser.username);
  expect(user.password).not.toBe(fakeUser.password);
});

it('should authenticate known user', async () => {
  await new User(fakeUser).save();
  const authenticatedUser = await User.authenticateBasic(fakeUser.username, fakeUser.password);
  expect(authenticatedUser).toBeDefined();
});

it('should get null for unknown user when none', async () => {
  const authenticatedUser = await User.authenticateBasic('nobody', 'unknown');
  expect(authenticatedUser).toBeNull();
});

it('should get null for unknown user when there are others', async () => {
  await new User(fakeUser).save();
  const authenticatedUser = await User.authenticateBasic('nobody', 'unknown');
  expect(authenticatedUser).toBeNull();
});

it('should return user when password good', async () => {
  const user = await new User(fakeUser).save();
  const comparedUser = await user.comparePassword(fakeUser.password);
  expect(user).toBe(comparedUser);
});

it('should return null when password bad', async () => {
  const user = await new User(fakeUser).save();
  const comparedUser = await user.comparePassword('wrongpassword');
  expect(comparedUser).toBeNull();
});

it('should generate a token', async () => {
  const user = await new User(fakeUser).save();
  const token = user.generateToken();
  expect(token).toBeDefined();
  const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
  expect(verifiedToken.role).toBe(user.role);
});

it('creating an existing user return user', async () => {
  const user = await new User.create(fakeUser);
  const foundOrCreated = await User.createFromOauth(user.username);
  expect(foundOrCreated.username).toBe(user.username);
  expect(foundOrCreated.email).toBe(user.email);
  expect(foundOrCreated.password).toBe(user.password);
});

it('creating from OAuth returns new user if not present', async () => {
  const foundOrCreated = await User.createFromOauth('newguy');
  expect(foundOrCreated.username).toBe('newguy');
  expect(foundOrCreated.password).not.toBe('none');
});

it('creating with missing email is an error', async () => {
  expect.assertions(1);
  await expect(User.createFromOauth(null)).rejects.toEqual('Validation Error');
});
