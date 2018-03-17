'use strict';

const User = require('../../model/user');
const faker = require('faker');
const Activity = require('../../model/activity');

const mock = module.exports = {};

mock.user = {};
mock.activity = {};
mock.activityLocation = {};
mock.activityHidden = {};
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



mock.activity.createOne = () => {
  let resultMock = null;

  return mock.user.createOne()
    .then(createdUserMock => resultMock = createdUserMock)
    .then(() => {
      // console.log('############', resultMock);
      return new Activity({
        name: faker.name.firstName(),
        location: faker.name.firstName(),
        display: 'true',
        leaderBoard: [{_id: resultMock.user._id, score: faker.random.number()}],
      }).save();
    })
    .then(activity => {
      resultMock.activity = activity;
      return resultMock;
    });
};
mock.activity.removeAll = () => Promise.all([Activity.remove()]);



mock.activityHidden.createOne = () => {
  let resultMock = null;

  return mock.user.createOne()
    .then(createdUserMock => resultMock = createdUserMock)
    .then(() => {
      // console.log('############', resultMock);
      return new Activity({
        name: faker.name.firstName(),
        location: faker.name.firstName(),
        display: 'false',
        leaderBoard: [{_id: resultMock.user._id, score: faker.random.number()}],
      }).save();
    })
    .then(activity => {
      resultMock.activity = activity;
      return resultMock;
    });
};
mock.activityHidden.removeAll = () => Promise.all([Activity.remove()]);




mock.admin.createOne = () => {
  let resultUser = {};
  resultUser.password = faker.internet.password();

  return new User({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    admin: true,
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

mock.activityLocation.createOne = () => {
  let resultMock = null;

  return mock.user.createOne()
    .then(createdUserMock => resultMock = createdUserMock)
    .then(() => {
      // console.log('############', resultMock);
      return new Activity({
        name: faker.name.firstName(),
        location: 'seattle',
        display: 'true',
        leaderBoard: [{_id: resultMock.user._id, score: faker.random.number()}],
      }).save();
    })
    .then(activity => {
      resultMock.activity = activity;
      return resultMock;
    });
};
mock.activityLocation.removeAll = () => Promise.all([Activity.remove()]);