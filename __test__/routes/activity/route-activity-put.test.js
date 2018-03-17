
'use strict';

const mock = require('../../lib/mock');
const superagent = require('superagent');
const server = require('../../../lib/server');
const Activity = require('../../../model/activity');
require('jest');

var mockActivity;
var mockAdmin;
var testData;

describe('PUT /api/v1/users/:id?', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeAll(() => mock.activity.createOne().then(data => mockActivity = data));
  beforeAll(() => mock.admin.createOne().then(data => mockAdmin = data));
  afterAll(mock.activity.removeAll);

  beforeAll(() => {
    return superagent.put(`:${process.env.PORT}/api/v1/activity/${mockActivity.activity._id}`)
      .set('Authorization', `Bearer ${mockAdmin.token}`)
      .send({
        name: '10k',
        location : 'seattle',
      })
      .then(response => {
        testData = response;
      });
  });

  describe('Valid request', () => {
    it('should return a 204 status code', () => {
      expect(testData.status).toEqual(204);
    });
    it('should have updated the name and location', () => {
      return Activity.findById(mockActivity.activity._id)
        .then(res => {
          expect(res.name).toEqual('10k');
          expect(res.location).toEqual('seattle');
        });
    });
  });


  describe('Invalid request', () => {
    it('should return a 401 NOT AUTHORIZED given back token', () => {
      return superagent.put(`:${process.env.PORT}/api/v1/activity/${mockActivity.activity._id}`)
        .set('Authorization', `Bearer ${mockActivity.user._id}`)
        .send({
          name: '15k',
          location: 'portland',
        })
        .catch(err => expect(err.status).toEqual(401));
    });

    it('should return a 404 status code for bad path.', () => {
      return superagent.put(`:${process.env.PORT}/api/v1/activity/234234234x`)
        .set('Authorization', `Bearer ${mockAdmin.token}`)
        .send({
          theBigName: '15k',
        })
        .catch(err => expect(err.status).toEqual(404));
    });
  });
});