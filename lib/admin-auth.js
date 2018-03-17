'use strict';

const errorHandler = require('./error-handler');
const debug = require('debug')('server:authn:admin');

module.exports = function(request, response, next) {
  debug(`request.user.admin === ${request.user.admin}`);
  if(request.user.admin !== true) {
    debug(`\trejected`);
    return errorHandler(new Error('authorization'), response);
  }
  debug(`\tapproved`);
  next();
};
