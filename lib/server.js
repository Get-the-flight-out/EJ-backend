'use strict';

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./error-handler');

const app = express();
const router = express.Router();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use('/api/v1', router);
require('../route/route-user')(router);
require('../route/route-lowfare')(router);

app.all('/{0,}',(request, response) => ( errorHandler(new Error('Path Error. Route not found.')), response));

const server = module.exports = {};
server.start = () => {
  return new Promise ((resolve, reject) => {
    if (server.isOn) return reject(new Error('Sever Error. Cannot start on new server  on the same port'));
    server.http = app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
      server.isOn = true;
      mongoose.connect(MONGODB_URI);
      return resolve(server);
    });
  });
};

server.stop = () => {
  return new Promise ((resolve, reject) => {
    if (!server.isOn) return reject(new Error('Sever Error. Cannot stop server that is not running.'));
    server.http.close(() => {
      server.isOn = false;
      mongoose.disconnect();
      return resolve();
    }); 
  });
};