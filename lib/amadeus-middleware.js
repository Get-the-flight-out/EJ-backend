'use strict';

const superagent = require('superagent');
const errorHandler = require('./error-handler');
const Inspiration = require('../model/inspiration');

const amadeus = module.exports = {};
const ERROR_MESSAGE = 'Missing search criteria.';

amadeus.lowfareSearch = (request, response, next) => {
  if (!request.query.origin ||
      !request.query.destination ||
      !request.query.departure_date) {
    return errorHandler(new Error(ERROR_MESSAGE), response);
  }
  let flightQueryData = {
    apikey: process.env.API_KEY,
    origin: request.query.origin,
    destination: request.query.destination,
    departure_date: request.query.departure_date,
  };

  request.query.nonstop ? flightQueryData.nonstop = request.query.nonstop : undefined;
  request.query.max_price ? flightQueryData.max_price = request.query.max_price : undefined;
  request.query.return_date ? flightQueryData.return_date = request.query.return_date : undefined;

  superagent.get(`${process.env.FLIGHT_URL}/low-fare-search`)
    .query(flightQueryData)
    .then(amaRes => request.lowfare = amaRes.body)
    .then(() => next())
    .catch(err => {
      errorHandler(err, response);
    });
};

amadeus.inspirationSearch = (request, response, next) => {
  if (!request.query.origin) {
    return errorHandler(new Error(ERROR_MESSAGE), response);
  }

  let flightQueryData = {
    apikey: process.env.API_KEY,
    origin: request.query.origin,
  };

  request.query.direct ? flightQueryData.direct = request.query.direct : undefined;
  request.query.duration ? flightQueryData.duration = request.query.duration : undefined;
  request.query.max_price ? flightQueryData.max_price = request.query.max_price : undefined;
  request.query.departure_date ? flightQueryData.departure_date= request.query.departure_date : undefined;

  if (!request.user.inspirationId) {
    fetchInspirationApi(flightQueryData, request, response, next);
  } else {
    Inspiration.findById(request.user.inspirationId)
      .then(insp => {
        if (((new Date() - insp._timestamp) / 36e5) > 1 ||
        !shallowCompare(flightQueryData, insp.flightQueryData)) {
          fetchInspirationApi(flightQueryData, request, response, next);
        } else {
          request.inspiration = JSON.parse(insp.searchResults);
          next();
        }
      })
      .catch(err => {
        errorHandler(err, response);
      });
  }
};

function fetchInspirationApi(flightQueryData, request, response, next) {
  superagent.get(`${process.env.FLIGHT_URL}/inspiration-search`)
    .query(flightQueryData)
    .then(amaRes => {
      new Inspiration({
        searchResults: JSON.stringify(amaRes.body),
        _timestamp: new Date(),
        userId: request.user._id,
        flightQueryData,
      }).save()
        .then(() => {
          request.inspiration = amaRes.body;
        })
        .then(() => next())
        .catch(err => {
          errorHandler(err, response);
        });
    })
    .catch(err => {
      errorHandler(err, response);
    });
}

function shallowCompare(objA, dbObj) {
  let retVal = true;
  const keys = Object.keys(dbObj);
  for (const key of keys) {
    if ((!dbObj[key] && !objA[key]) || key === '$init') continue;
    if (objA[key] !== dbObj[key]) {
      console.log('key miss match', 'key', key, objA[key], dbObj[key]);
      retVal = false;
    }
  }
  return retVal;
}
