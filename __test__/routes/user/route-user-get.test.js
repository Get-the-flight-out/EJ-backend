'use strict';

const server = require('../../../lib/server');
const superagent = require('superagent');
const mock = require('../../lib/mock');
require('jest');

describe('GET /api/v1/signin', function () {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mock.user.removeAll);

  describe('Valid Requests', () => {
    beforeAll(() =>
      mock.user.createOne().then(data => this.mockData = data));
    beforeAll(() => {
      let encoded = Buffer.from(`${this.mockData.user.username}:${this.mockData.password}`).toString('base64');

      return superagent.get(`:${process.env.PORT}/api/v1/signin`)
        .set('Authorization', `Basic ${encoded}`)
        .then(response => this.response = response)
        .catch(console.log);
    });

    it('should return a 200 OK on valid signin', () => {
      expect(this.response.status).toEqual(200);
    });
    it('should return a JSON Web Token as the responseponse body', () => {
      let tokenParts = this.response.body.split('.');
      let signature = JSON.parse(Buffer.from(tokenParts[0], 'base64').toString());
      let token = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());

      expect(signature.typ).toEqual('JWT');
      expect(token).toHaveProperty('token');
    });
  });

  describe('Invalid Requests', () => {
    it('should return a 401 NOT AUTHORIZED given invalid username', () => {
      let encoded = Buffer.from(`${'BADUSERNAME'}:${this.mockData.password}`).toString('base64');

      return superagent.get(`:${process.env.PORT}/api/v1/signin`)
        .set('Authorization', `Basic ${encoded}`)
        .catch(err => expect(err.status).toEqual(401));
    });
    it('should return a 401 NOT AUTHORIZED given invalid password', () => {
      let encoded = Buffer.from(`${this.mockData.user.userName}:${'INVALIDPASSWORD'}`).toString('base64');

      return superagent.get(`:${process.env.PORT}/api/v1/signin`)
        .set('Authorization', `Basic ${encoded}`)
        .catch(err => expect(err.status).toEqual(401));
    });
    it('should return a 401 NOT AUTHORIZED given missing username', () => {
      let encoded = Buffer.from(`:${'INVALIDPASSWORD'}`).toString('base64');

      return superagent.get(`:${process.env.PORT}/api/v1/signin`)
        .set('Authorization', `Basic ${encoded}`)
        .catch(err => expect(err.status).toEqual(401));
    });
    it('should return a 401 NOT AUTHORIZED given missing password', () => {
      let encoded = Buffer.from(`${this.mockData.user.userName}:`).toString('base64');

      return superagent.get(`:${process.env.PORT}/api/v1/signin`)
        .set('Authorization', `Basic ${encoded}`)
        .catch(err => expect(err.status).toEqual(401));
    });
    it('should return a 401 NOT AUTHORIZED given malformed user headers', () => {
      Buffer.from(`${this.mockData.user.userName}:`).toString('base64');

      return superagent.get(`:${process.env.PORT}/api/v1/signin`)
        .set('Authorization', 'Basic')
        .catch(err => expect(err.status).toEqual(401));
    });
    it('should return a 401 NOT AUTHORIZED given missing user headers', () => {
      Buffer.from(`${this.mockData.user.userName}:`).toString('base64');

      return superagent.get(`:${process.env.PORT}/api/v1/signin`)
        .catch(err => expect(err.status).toEqual(401));
    });
  });
});
describe('GET /api/v1/users/:id?', function() {
  beforeAll(server.start);
  beforeAll(() => mock.user.createOne().then(data => this.mockUser = data));
  afterAll(server.stop);
  afterAll(mock.user.removeAll);

  describe('Valid Requests', () => {
    it('should return a 200 status code and a body of an Array', () => {
      return mock.user.createOne()
        .then(mock => {
          return superagent.get(`:${process.env.PORT}/api/v1/users`)
            .set('Authorization', `Bearer ${mock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body).toBeInstanceOf(Array);
        });
    });
    it('should return 200 status with body {activities: [], name: ""}', () => {
      return mock.user.createOne()
        .then(mock => {
          return superagent.get(`:${process.env.PORT}/api/v1/users/${mock.user._id}`)
            .set('Authorization', `Bearer ${mock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body).toBeInstanceOf(Object);
          expect(response.body).toHaveProperty('name');
        });
    });
  });
  describe('Invalid Requests', () => {
    it('should return 401 for no token', () => {
      return mock.user.createOne()
        .then(() => {
          return superagent.get(`:${process.env.PORT}/api/v1/users`)
            .set('Authorization', `Bearer of bad news`);
        })
        .catch(error => {
          expect(error.status).toEqual(401);
          expect(error).toBeInstanceOf(Error);
        });
    });
    it('should return 404 for bad path', () => {
      return mock.user.createOne()
        .then(mock => {
          return superagent.get(`:${process.env.PORT}/api/v1/user`)
            .set('Authorization', `Bearer ${mock.token}`);
        })
        .catch(error => {
          expect(error.status).toEqual(404);
          expect(error).toBeInstanceOf(Error);
        });
    });
    it('should return 401 for no token', () => {
      return mock.user.createOne()
        .then(mock => {
          return superagent.get(`:${process.env.PORT}/api/v1/users/${mock.user._id}`)
            .set('Authorization', `Bearer of bad news`);
        })
        .catch(error => {
          expect(error.status).toEqual(401);
          expect(error).toBeInstanceOf(Error);
        });
    });
    it('should return 404 for bad path', () => {
      return mock.user.createOne()
        .then(mock => {
          return superagent.get(`:${process.env.PORT}/api/v1/users/${mock.user._id}badpath`)
            .set('Authorization', `Bearer ${mock.token}`);
        })
        .catch(error => {
          expect(error.status).toEqual(404);
          expect(error).toBeInstanceOf(Error);
        });
    });
  });
});
