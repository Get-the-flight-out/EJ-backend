'use strict';

const server = require('../../../lib/server');
const superagent = require('superagent');
const mock = require('../../lib/mock');


describe('GET', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mock.user.removeAll);
  afterAll(mock.activityLocation.removeAll);
  var testRes;
  var mockUser;
  var mockActivity;

  beforeAll(() => mock.admin.createOne().then(data => {
    mockUser = data;
  }));

  beforeAll(() => mock.activityLocation.createOne().then(data => {
    mockActivity = data;
    return superagent.get(`:${process.env.PORT}/api/v1/location/${mockActivity.activity.location}`)
      .set('Authorization', `Bearer ${mockActivity.token}`)
      .then(res => testRes = res);
  }));
  
  describe('GET /api/v1/location/:location?', function() {
    describe('Valid Requests for location', () => {
      it('should return a valid 200 status for getting all back', () => {
        expect(testRes.status).toEqual(200);
      });
      it('should be an array of IDs', () => {
        expect(Array.isArray(testRes.body)).toBe(true);
      });
      it('should be match the id of the non approved activity', () => {
        expect(mockActivity.activity._id.toString()).toBe(testRes.body[0]);
      });
    });

    describe('Invalid Requests for new activity', () => {
      it('should return a 401 status code for not auth', () => {
        return superagent.get(`:${process.env.PORT}/api/v1/location/${mockActivity.location}`)
          .set('Authorization', `Bearer ${mockActivity.token}`)
          .catch(err => expect(err.status).toEqual(401));
      });
      it('should return a 404 bad path', () => {
        return superagent.get(`:${process.env.PORT}/api/v1/local/${mockActivity.location}`)
          .set('Authorization', `Bearer ${mockUser.token}`)
          .catch(err => expect(err.status).toEqual(404));
      });
    });
  });
});