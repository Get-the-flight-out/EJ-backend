'use strict';

const server = require('../../../lib/server');
const superagent = require('superagent');
const mock = require('../../lib/mock');
const faker = require('faker');
const Activity = require('../../../model/activity');

describe('POST overall!!!!', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mock.user.removeAll);
  afterAll(mock.activity.removeAll);
  var testRes;
  var mockUser;
  var testRes2;

  beforeAll(() => mock.user.createOne().then(data => {
    mockUser = data;
    return superagent.post(`:${process.env.PORT}/api/v1/activity`)
      .set('Authorization', `Bearer ${mockUser.token}`)
      .send({
        name: faker.name.firstName(),
        location: faker.name.lastName(),
      })
      .then(res => testRes = res);
  }));

  describe('POST /api/v1/activity', function() {
    describe('Valid Requests for new activity', () => {
      it('should return a valid 201 CREATED status code', () => {
        expect(testRes.status).toEqual(201);
      });
      it('should return a valid body', () => {
        expect(testRes.body).toHaveProperty('name');
        expect(testRes.body).toHaveProperty('location');
        expect(testRes.body).toHaveProperty('_id');
      });
    });

    describe('Invalid Requests for new activity', () => {
      it('should return a 401 status code for not auth', () => {
        return superagent.post(`:${process.env.PORT}/api/v1/activity`)
          .set('Authorization', `Bearer badtoken`)
          .catch(err => expect(err.status).toEqual(401));
      });
      it('should return a 400 status code, invalid body', () => {
        return superagent.post(`:${process.env.PORT}/api/v1/activity`)
          .set('Authorization', `Bearer ${mockUser.token}`)
          .send({
            username: faker.name.firstName(),
            location: faker.name.lastName(),
          })
          .catch(err => expect(err.status).toEqual(400));
      });
      it('should return a 409 DUPLICATE KEY status when creating a user that already exists', () => {
        return superagent.post(`:${process.env.PORT}/api/v1/activity`)
          .set('Authorization', `Bearer ${mockUser.token}`)
          .send(testRes.body)
          .catch(err => expect(err.status).toEqual(409));
      });
    });
  });


  describe('POST /api/v1/activity/id', function() {

    describe('Valid Requests for updating leaderboard', () => {
      beforeAll(() => {
        return superagent.post(`:${process.env.PORT}/api/v1/activity/${testRes.body._id}`)
          .set('Authorization', `Bearer ${mockUser.token}`)
          .send({
            score: faker.random.number(),
          })
          .then(res => testRes2 = res)
          .then(() => {
            return superagent.post(`:${process.env.PORT}/api/v1/activity/${testRes.body._id}`)
              .set('Authorization', `Bearer ${mockUser.token}`)
              .send({
                score: faker.random.number(),
              });
          });
      });
      it('should return a valid 201 CREATED status code', () => {
        expect(testRes2.status).toEqual(201);
      });
      it('should return a valid body', () => {
        return Activity.findById(testRes.body._id)
          .then(res => {
            expect(res.leaderBoard[0]).toHaveProperty('score');
          });
      });
    });

    describe('Invalid Requests for updating leaderboard', () => {
      it('should return a 401 status code for not auth', () => {
        return superagent.post(`:${process.env.PORT}/api/v1/activity/${testRes.body._id}`)
          .set('Authorization', `Bearer badtoken`)
          .catch(err => expect(err.status).toEqual(401));
      });
      it('should return a 400 status code, invalid body', () => {
        return superagent.post(`:${process.env.PORT}/api/v1/activity/${testRes.body._id}`)
          .set('Authorization', `Bearer ${mockUser.token}`)
          .send({
            scoreBIGTIME: faker.random.number(),
          })
          .catch(err => expect(err.status).toEqual(400));
      });
      it('should return a 404 for bad path', () => {
        return superagent.post(`:${process.env.PORT}/api/v1/activity/12345`)
          .set('Authorization', `Bearer ${mockUser.token}`)
          .send(testRes.body)
          .catch(err => expect(err.status).toEqual(404));
      });
    });
  });
});
