'use strict';

const superagent = require('superagent');
const errorHandler = require('./error-handler');

const amadeus = module.exports = {};

const ERROR_MESSAGE = 'Missing search criteria.';

amadeus.lowfareSearch = (request, response, next) => {
  if (!request.body.origin) {
    return errorHandler(new Error(ERROR_MESSAGE), response);
  }
  let flightData = {
    apikey: process.env.API_KEY,
    origin: request.body.origin,
    destination: request.body.destination,
    departure_date: request.body.departure_date,
  };

  //adding a return data if user adds one.
  if (request.body.return_date) {
    flightData.return_date = request.body.return_date;
  }

  superagent.get(`${process.env.FLIGHT_URL}/low-fare-search`)
    .query(flightData)
    // .query(`apikey=${process.env.API_KEY}`)
    // .query(`origin=${request.body.origin}`)
    // .query(`destination=${request.body.destination}`)
    // .query(`departure_date=${request.body.departure_date}`)
    // .query(`return_date=${request.body.return_date}`)
    
    .then(amaRes => request.flightInfo = amaRes.body)
    .then(() => next())
    .catch(err => errorHandler(err, response));
};

amadeus.inspirationSearch = () => {
  
};