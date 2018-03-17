'use strict';

const server = require('../../../lib/server');
const superagent = require('superagent');
const mock = require('../../lib/mock');


describe('DELETE overall!!!!', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mock.user.removeAll);
  afterAll(mock.activity.removeAll);
  var testRes;
  var mockUser;
  var mockUser2;
  var mockAdmin;


  beforeAll(() => mock.admin.createOne().then(res => mockAdmin = res));
  beforeAll(() => mock.activity.createOne().then(data => mockUser2 = data));
  beforeAll(() => mock.activity.createOne().then(data => {
    mockUser = data;
    return superagent.delete(`:${process.env.PORT}/api/v1/activity/${mockUser.activity._id}`)
      .set('Authorization', `Bearer ${mockAdmin.token}`)
      .then(res => testRes = res);
  }));


  describe('DELETE /api/v1/activity', function() {
    describe('Valid Requests for new activity', () => {
      it('should return a valid 204 status code', () => {
        expect(testRes.status).toEqual(204);
      });
    });

    describe('Invalid Requests for delete activity', () => {
      it('should return a 401 status code for not auth', () => {
        return superagent.delete(`:${process.env.PORT}/api/v1/activity/${mockUser2.activity._id}`)
          .set('Authorization', `Bearer ${mockUser2.token}`)
          .catch(err => expect(err.status).toEqual(401));
        
      });
      it('should return a 404 for invalid route', () => {
        return superagent.delete(`:${process.env.PORT}/api/v1/activity/${mockUser2.activity._id}1`)
          .set('Authorization', `Bearer ${mockAdmin.token}`)
          .catch(err => expect(err.status).toEqual(404));
      });
    });
  });
});
