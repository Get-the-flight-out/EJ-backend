'use strict';


const bodyParser = require('body-parser').json();
// const errorHandler = require('../lib/error-handler');
// const basicAuth = require('../lib/basic-auth');
// const bearerAuth = require('../lib/bearer-auth');
const lowfareSearch = require('../lib/amadeus-middleware').lowfareSearch;
const inspirationSearch = require('../lib/amadeus-middleware').inspirationSearch;


module.exports = function(router) {
  router.get('/lowfare-search', bodyParser, lowfareSearch, (request, response) => {
    response.status(200).json(request.lowfare.results[0].itineraries[0]);
  });

  router.get('/inspiration-search', bodyParser, inspirationSearch, (request, response) => {
    response.status(200).json(request.inspiration.results);
  });
};
