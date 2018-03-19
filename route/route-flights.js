'use strict';

const checkArea = require('../top-airports/top-airports');
const bodyParser = require('body-parser').json();
// const errorHandler = require('../lib/error-handler');
// const basicAuth = require('../lib/basic-auth');
// const bearerAuth = require('../lib/bearer-auth');
const lowfareSearch = require('../lib/amadeus-middleware').lowfareSearch;
const inspirationSearch = require('../lib/amadeus-middleware').inspirationSearch;


module.exports = function(router) {
  router.get('/lowfare-search', bodyParser, lowfareSearch, (request, response) => {
    // let flights = request.lowfare.results.map(flight => flight.fare.total_price);
    let flights = request.lowfare.results.map(flight => flight);
    response.status(200).json(flights);
  });

  router.get('/inspiration-search', bodyParser, inspirationSearch, (request, response) => {
    let test = checkArea.checkAirport(request.inspiration.results, request.body.area);
    response.status(200).json(test);
    // response.status(200).json(request.inspiration.results);
  });
};
