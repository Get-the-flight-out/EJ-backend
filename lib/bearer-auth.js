'use strict';
const errorHandler = require('./error-handler');
const User = require('../model/user');
const jsonWebToken = require('jsonwebtoken');
const debug = require('debug')('server:authn:bear ');

const ERROR_MESSAGE = 'Authorization Failed';

module.exports = function(request, response, next) {
  let authHeader = request.headers.authorization;
  debug(`authHeader === ${authHeader}`);
  if(!authHeader) {
    debug(`\trejected`);
    return errorHandler(new Error(ERROR_MESSAGE), response);
  }
  let token = authHeader.split('Bearer ')[1];
  if(!token) {
    debug(`\trejected`);
    return errorHandler(new Error(ERROR_MESSAGE), response);
  }
  return jsonWebToken.verify(token, process.env.APP_SECRET, (err, decodedValue) => {
    if(err) {
      debug(`\trejected`);
      err.message = ERROR_MESSAGE;
      return errorHandler(err, response);
    }
    return User.findOne({compareHash: decodedValue.token})
      .then(user => {
        if(!user) {
          debug(`\trejected`);
          return errorHandler(new Error(ERROR_MESSAGE), response);
        }
        request.user = user;
        debug(`\tapproved`);
        next();
      })
      .catch(err => {
        debug(`\trejected error: ${err}`);
        errorHandler(err, response);
      });
  });
};
