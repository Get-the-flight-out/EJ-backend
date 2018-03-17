'use strict';

const superagent = require('superagent');
const errorHandler = require('./error-handler');

const amadeus = module.exports = {};

const ERROR_MESSAGE = 'Missing search criteria.';

amadeus.lowfareSearch = (request, response, next) => {
  if (!request.body.origin) {
    return errorHandler(new Error(ERROR_MESSAGE), response);
  }
  
  superagent.get(`${process.env.FLIGHT_URL}/low-fare-search`)
    .query(`apikey=${process.env.API_KEY}`)
    .query(`origin=${request.body.origin}`)
    .query(`destination=${request.body.destination}`)
    .query(`departure_date=${request.body.departure_date}`)
    
    .then(data => request.body.results = data)
    .then(() => next())
    .catch(err => errorHandler(err, response));
};

amadeus.inspirationSearch = () => {
  
};