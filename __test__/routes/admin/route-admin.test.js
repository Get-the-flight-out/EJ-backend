'use strict';

const server = require('../../../lib/server');
const superagent = require('superagent');
const mock = require('../../lib/mock');


describe('GET overall!!!!', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mock.admin.removeAll);
  afterAll(mock.activityHidden.removeAll);
  var testRes;
  var mockActivity;
  var mockAdmin;


  beforeAll(() => mock.admin.createOne().then(data => {
    mockAdmin = data;
  }));

  beforeAll(() => mock.activityHidden.createOne().then(data => {
    mockActivity = data;
    return superagent.get(`:${process.env.PORT}/api/v1/admin`)
      .set('Authorization', `Bearer ${mockAdmin.token}`)
      .then(res => testRes = res);
  }));

  describe('GET /api/v1/admin', function() {
    describe('Valid Requests for admin queue', () => {
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
        return superagent.get(`:${process.env.PORT}/api/v1/admin`)
          .set('Authorization', `Bearer ${mockActivity.token}`)
          .catch(err => expect(err.status).toEqual(401));
      });
      it('should return a 404 bad path', () => {
        return superagent.get(`:${process.env.PORT}/api/v1/admi`)
          .set('Authorization', `Bearer ${mockAdmin.token}`)
          .catch(err => expect(err.status).toEqual(404));
      });
    });
  });
});