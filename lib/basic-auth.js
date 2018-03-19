'use strict';

const errorHandler = require('./error-handler');

module.exports = function(request, response, next) {
  let authHeaders = request.headers.authorization;
  if(!authHeaders) {
    return errorHandler(new Error('Authorization failed. Headers do not match requestuirements.'), response);
  }
  let base64 = authHeaders.split('Basic ')[1];
  if(!base64) {
    return errorHandler(new Error('Authorization failed. Username and Password required.'), response);
  }
  let [username, password] = Buffer.from(base64, 'base64').toString().split(':');
  request.auth = {username, password};
  if(!request.auth.username) {
    return errorHandler(new Error('Authorization failed. Username required.'), response);
  }
  if(!request.auth.password) {
    return errorHandler(new Error('Authorization failed. Password required.'), response);
  }
  next();
};
