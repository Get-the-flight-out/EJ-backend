'use strict';


module.exports = function (err, response) {
  let msg = err.message.toLowerCase();

  switch(true) {
  case msg.includes('validation'):
    return response.status(400).send(`${err.name}: ${err.message}`);
  case msg.includes('authorization'):
    return response.status(401).send(`${err.name}: ${err.message}`);
  case msg.includes('path error'):
    return response.status(404).send(`${err.name}: ${err.message}`);
  case msg.includes('objectid failed'):
    return response.status(404).send(`${err.name}: ${err.message}`);
  case msg.includes('duplicate key'):
    return response.status(409).send(`${err.name}: ${err.message}`);
  case msg.includes('already made'):
    return response.status(409).send(`${err.name}: ${err.message}`);
  default: return response.status(500).send(`${err.name}: ${err.message}`);
  }
};
