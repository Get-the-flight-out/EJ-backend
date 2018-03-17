'use strict';

const superagent = require('superagent');
const errorHandler = require('./error-handler');

const amadeus = module.exports = {};

const ERROR_MESSAGE = 'Missing search criteria.';

amadeus.lowfareSearch = (request, response, next) => {
  if (!request.body.origin ||
      !request.body.destination ||
      !request.body.departure_date) {
    return errorHandler(new Error(ERROR_MESSAGE), response);
  }
  let flightQueryData = {
    apikey: process.env.API_KEY,
    origin: request.body.origin,
    destination: request.body.destination,
    departure_date: request.body.departure_date,
  };

  //adding a return data if user adds one.
  if (request.body.return_date) {
    flightQueryData.return_date = request.body.return_date;
  }

  superagent.get(`${process.env.FLIGHT_URL}/low-fare-search`)
    .query(flightQueryData)
    .then(amaRes => request.lowfare = amaRes.body)
    .then(() => next())
    .catch(err => errorHandler(err, response));
};

amadeus.inspirationSearch = (request, response, next) => {
  if (!request.body.origin) {
    return errorHandler(new Error(ERROR_MESSAGE), response);
  }

  let flightQueryData = {
    apikey: process.env.API_KEY,
    origin: request.body.origin,
  };

  // TODO: Max price, etc options
  superagent.get(`${process.env.FLIGHT_URL}/inspiration-search`)
    .query(flightQueryData)
    .then(amaRes => request.inspiration = amaRes.body)
    .then(() => next())
    .catch(err => errorHandler(err, response));
};
