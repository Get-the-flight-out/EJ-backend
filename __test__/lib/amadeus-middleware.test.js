'use strict';

const amaMiddle = require('../../lib/amadeus-middleware');
const requestMock = require('express-request-mock');
const server = require('../../lib/server');
const superagent = require('superagent');
const faker = require('faker');
const mocks = require('./mock');

require('jest');
// jest.setTimeout(10000);


describe('AMA Middleware', function () {
  beforeAll(() => server.start());
  afterAll(() => server.stop());
  beforeAll(() => {
    let user = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      homeAirport: faker.internet.userName(),
      password: faker.internet.userName(),
    };
    let storedUser;
    return superagent.post(`:${process.env.PORT}/api/v1/signup`)
      .send(user)
      .then(response => {
        storedUser = response;
        console.log(storedUser);
      })
      .catch(console.log);
  });

  describe('LOWFARE FLIGHT REQUEST', () => {
    const request = {
      query: {
        origin: 'sea',
        destination: 'icn',
        departure_date: '2018-03-29',
        nonstop: 'true',
      },
    };

    it('returns flight data', () => {
      return requestMock(amaMiddle.lowfareSearch, request, ()=>{})
        .then(({req}) => {
          expect(req.lowfare).toHaveProperty('currency');
          expect(req.lowfare).toHaveProperty('results');
          expect(req.lowfare.results[0]).toHaveProperty('itineraries');
          expect(req.lowfare.results[0]).toBeInstanceOf(Object);
        });
    });
  });

  describe('sends off for flight data', function () {
    beforeAll(() => {
      return mocks.user.createOne()
        .then(mockObj => {
          this.mockObj = mockObj;
          console.log('User Mock', mockObj);
        });
    });


    it('returns flight data', () => {
      const request = {
        query: {
          origin: 'sea',
          area: 'usa',
          max_price: '100',
        },
        user: this.mockObj.user,
        inspiration: null,
      };
      return requestMock(amaMiddle.inspirationSearch, request, ()=>{})
        .then(({req}) => {
          console.log('BOOM', req.inspiration.results);
          expect(req.inspiration.results[0]).toHaveProperty('destination');
          expect(req.inspiration.results[0]).toHaveProperty('price');
          expect(req.inspiration.results[0]).toHaveProperty('departure_date');
          expect(req.inspiration.results[0]).toHaveProperty('return_date');
        });
    });
  });

});
