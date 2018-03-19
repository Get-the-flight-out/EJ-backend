'use strict';

const errorHandler = require('./error-handler');


module.exports = function(request, response, next) {
  if(request.user.admin !== true) {
    return errorHandler(new Error('authorization'), response);
  }
  next();
};
