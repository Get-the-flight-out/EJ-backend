'use strict';

const errorHandler = require('./error-handler');
const debug = require('debug')('server:authz:basic');

module.exports = function(request, response, next) {
  let authHeaders = request.headers.authorization;
  debug(`authHeaders === ${authHeaders}`);
  if(!authHeaders) {
    debug(`\trejected`);
    return errorHandler(new Error('Authorization failed. Headers do not match requestuirements.'), response);
  }
  let base64 = authHeaders.split('Basic ')[1];
  if(!base64) {
    debug(`\trejected`);
    return errorHandler(new Error('Authorization failed. Username and Password required.'), response);
  }
  let [username, password] = Buffer.from(base64, 'base64').toString().split(':');
  request.auth = {username, password};
  if(!request.auth.username) {
    debug(`\trejected`);
    return errorHandler(new Error('Authorization failed. Username required.'), response);
  }
  if(!request.auth.password) {
    debug(`\trejected`);
    return errorHandler(new Error('Authorization failed. Password required.'), response);
  }
  debug(`\tapproved`);
  next();
};
