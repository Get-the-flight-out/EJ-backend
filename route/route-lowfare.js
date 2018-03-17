'use strict';


const bodyParser = require('body-parser').json();
// const errorHandler = require('../lib/error-handler');
// const basicAuth = require('../lib/basic-auth');
// const bearerAuth = require('../lib/bearer-auth');
const lowfareSearch = require('../lib/amadeus-middleware').lowfareSearch;


module.exports = function(router) {
  router.get('/lowfare-search', bodyParser, lowfareSearch, (request, response) => {
    console.log('REQUEST:', request.flightInfo.results);
    // response.status(200).send(request.results.currency);
    response.status(200).json(request.flightInfo.results);
  });
};
