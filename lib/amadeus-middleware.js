'use strict';

const superagent = require('superagent');
const errorHandler = require('./error-handler');
const Inspiration = require('../model/inspiration');

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
  request.body.nonstop ? flightQueryData.nonstop = request.body.nonstop : undefined;
  request.body.max_price ? flightQueryData.max_price = request.body.max_price : undefined;
  request.body.return_date ? flightQueryData.return_date = request.body.return_date : undefined;

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

  request.body.direct ? flightQueryData.direct = request.body.direct : undefined;
  request.body.duration ? flightQueryData.duration = request.body.duration : undefined;
  request.body.max_price ? flightQueryData.max_price = request.body.max_price : undefined;
  request.body.destination ? flightQueryData.destination = request.body.destination : undefined;
  request.body.departure_date ? flightQueryData.departure_date= request.body.departure_date : undefined;

  // Inspiration.findById(request.user.inspiration._id)
  //   .then(insp => {
  //     if (insp) {
  //       if (insp.timestamps) {

  //       }
  //     }
  //   })

  superagent.get(`${process.env.FLIGHT_URL}/inspiration-search`)
    .query(flightQueryData)
    .then(amaRes => {
      new Inspiration({
        searchResults: JSON.stringify(amaRes.body),
        _timestamp: new Date(),
        userId: request.user._id,
      }).save()
        .then(() => {
          request.inspiration = amaRes.body;
        })
        .then(() => next())
        .catch(err => errorHandler(err, response));
    })
    .catch(err => errorHandler(err, response));
};
