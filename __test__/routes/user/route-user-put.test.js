
'use strict';

const faker = require('faker');
const mock = require('../../lib/mock');
const superagent = require('superagent');
const server = require('../../../lib/server');
require('jest');

describe('PUT /api/v1/users/:id?', function() {
  beforeAll(server.start);
  beforeAll(() => mock.user.createOne().then(data => this.mockUser = data));
  afterAll(server.stop);
  afterAll(mock.user.removeAll);

  describe('Valid request', () => {
    it('should return a 200 status code', () => {
      let mockUser = null;
      return mock.user.createOne()
        .then(mock => {
          mockUser = mock;
          return superagent.put(`:${process.env.PORT}/api/v1/users/${mockUser.user._id}`)
            .set('Authorization', `Bearer ${mock.token}`)
            .send({
              username: faker.internet.userName(),
              email: faker.internet.email(),
            });
        })
        .then(response => {
          expect(response.status).toEqual(204);
          expect(response.body).toBeInstanceOf(Object);
        });
    });
  });

  describe('Invalid request', () => {
    it('should return a 401 NOT AUTHORIZED given back token', () => {
      let mockUser = null;
      return mock.user.createOne()
        .then(mock => {
          mockUser = mock;
          return superagent.put(`:${process.env.PORT}/api/v1/users/${mockUser.user._id}`)
            .set('Authorization', 'Bearer BADTOKEN')
            .send({
              username: faker.internet.userName(),
              email: faker.internet.email(),
            });
        })
        .catch(err => expect(err.status).toEqual(401));
    });
      
    it('should return a 400 BAD REQUEST on improperly formatted body', () => {
      let mockUser = null;
      return mock.user.createOne()
        .then(mock => {
          mockUser = mock;
          return superagent.put(`:${process.env.PORT}/api/v1/users/${mockUser.user._id}`)
            .set('Authorization', `Bearer ${mock.token}`)
            .send({});
        })
        .catch(err => expect(err.status).toEqual(400));
    });

    it('should return a 404 BAD PATH for a valid request made with a wrong path', () => {
      let mockUser = null;
      return mock.user.createOne()
        .then(mock => {
          mockUser = mock;
          return superagent.put(`:${process.env.PORT}/api/v1/user/${mockUser.user._id}`)
            .set('Authorization', `Bearer ${mock.token}`)
            .send({
              username: faker.internet.userName(),
              email: faker.internet.email(),
            });
        })
        .catch(err => expect(err.status).toEqual(404));
    });
    it('should return a 404 Error for updating an account that isnt yours', () => {
      beforeAll(() => {
        this.mockUser = {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
          admin: false,
          activities: [],
        };
        return superagent.post(`:${process.env.PORT}/api/v1/signup`)
          .send(this.mockUser)
          .then(response => this.response = response)
          .catch(console.log);
      });
      // let mockUser2 = null;
      return mock.user.createOne()
        .then(mock => {
          this.mockUser= mock;
          return superagent.put(`:${process.env.PORT}/api/v1/user/${this.mockUser.user._id}`)
            .set('Authorization', `Bearer ${mock.token}`)
            .send({
              username: faker.internet.userName(),
              email: faker.internet.email(),
            });
        })
        .catch(err => expect(err.status).toEqual(404));
    });
  });
});