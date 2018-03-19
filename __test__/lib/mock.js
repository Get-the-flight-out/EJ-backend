'use strict';

const User = require('../../model/user');
const faker = require('faker');

const mock = module.exports = {};

mock.user = {};
mock.admin = {};

mock.user.createOne = () => {
  let resultUser = {};
  resultUser.password = faker.internet.password();

  return new User({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    admin: false,
    activities: [],
  })
    .generatePasswordHash(resultUser.password)
    .then(user => resultUser.user = user)
    .then(user => user.generateToken())
    .then(token => resultUser.token = token)
    .then(() => {
      return resultUser;
    });
};
mock.user.removeAll = () => Promise.all([User.remove()]);

mock.admin.createOne = () => {
  let resultUser = {};
  resultUser.password = faker.internet.password();

  return new User({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    admin: true,
  })
    .generatePasswordHash(resultUser.password)
    .then(user => resultUser.user = user)
    .then(user => user.generateToken())
    .then(token => resultUser.token = token)
    .then(() => {
      return resultUser;
    });
};
