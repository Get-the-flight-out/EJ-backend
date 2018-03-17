'use strict';

const server = require('../../../lib/server');
const superagent = require('superagent');
const mock = require('../../lib/mock');

// const Activity = require('../../../model/activity');

describe('GET overall!!!!', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mock.user.removeAll);
  afterAll(mock.activity.removeAll);
  var testRes;
  var testRes2;
  var mockActivity;
  var mockActivity2;
  var testResLeader;


  beforeAll(() => mock.activity.createOne().then(data => {
    mockActivity = data;
    return superagent.get(`:${process.env.PORT}/api/v1/activity`)
      .set('Authorization', `Bearer ${mockActivity.token}`)
      .then(res => testRes = res);
  }));

  describe('GET /api/v1/activity', function() {
    describe('Valid Requests for new activity', () => {
      it('should return a valid 200 status for getting all back', () => {
        expect(testRes.status).toEqual(200);
      });
      it('should be an array of IDs', () => {
        expect(Array.isArray(testRes.body)).toBe(true);
      });
    });

    describe('Invalid Requests for new activity', () => {
      it('should return a 401 status code for not auth', () => {
        return superagent.get(`:${process.env.PORT}/api/v1/activity`)
          .set('Authorization', `Bearer badtoken`)
          .catch(err => expect(err.status).toEqual(401));
      });
      it('should return a 404 bad path', () => {
        return superagent.post(`:${process.env.PORT}/api/v1/activi`)
          .set('Authorization', `Bearer ${mockActivity.token}`)
          .catch(err => expect(err.status).toEqual(404));
      });
      it('should return a 404 bad path', () => {
        return superagent.post(`:${process.env.PORT}/api/v1/activi`)
          .set('Authorization', `Bearer ${mockActivity.token}`)
          .catch(err => expect(err.status).toEqual(404));
      });
    });
  });


  beforeAll(() => mock.activity.createOne().then(data => {
    mockActivity2 = data;
    return superagent.get(`:${process.env.PORT}/api/v1/activity/${mockActivity2.activity._id}`)
      .set('Authorization', `Bearer ${mockActivity2.token}`)
      .then(res => testRes2 = res);
  }));

  describe('GET /api/v1/activity/id', function() {
    describe('Valid Requests for new activity', () => {
      it('should return a valid 200 status code for get one', () => {
        expect(testRes2.status).toEqual(200);
      });
      it('should have name and location on a single activity', () => {
        expect(testRes2.body[0]).toHaveProperty('name');
        expect(testRes2.body[0]).toHaveProperty('location');
      });
    });

    describe('Valid Requests for leaderboard', () => {
      it('should return a valid 200 status code for get one', () => {
        return superagent.get(`:${process.env.PORT}/api/v1/activity/${mockActivity2.activity._id}/leaderboard`)
          .set('Authorization', `Bearer ${mockActivity2.token}`)
          .then(res => testResLeader = res)
          .then(() => {
            expect(testResLeader.status).toEqual(200);
            expect(testResLeader.body[0]).toHaveProperty('_id');
            expect(testResLeader.body[0]).toHaveProperty('score');
          });
      });
    });

    describe('inValid Requests for leaderboard', () => {
      it('should return a valid 200 status code for get one', () => {
        return superagent.get(`:${process.env.PORT}/api/v1/activity/1234234234/leaderboard`)
          .set('Authorization', `Bearer ${mockActivity2.token}`)
          .catch(err => expect(err.status).toEqual(404));
      });
    });
   

    describe('Invalid Requests for new activity', () => {
      it('should return a 401 status code for not auth', () => {
        return superagent.get(`:${process.env.PORT}/api/v1/activity/${mockActivity2.activity._id}`)
          .set('Authorization', `Bearer badtoken`)
          .catch(err => expect(err.status).toEqual(401));
      });
      it('should return a 404 bad path', () => {
        return superagent.get(`:${process.env.PORT}/api/v1/activity/${mockActivity2.activity._id}1`)
          .set('Authorization', `Bearer ${mockActivity2.token}`)
          .catch(err => expect(err.status).toEqual(404));
      });
    });
  });
});
