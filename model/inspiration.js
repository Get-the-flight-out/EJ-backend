'use strict';

const mongoose = require('mongoose');
const User = require('./user');

const Inspiration = mongoose.Schema({
  searchResults: {type: String, required: true},
  _timestamp: {type: Date},
  flightQueryData: {
    apikey: {type: String, required: true},
    origin: {type: String, required: true},
    direct: {type: Boolean},
    duration: {type: Number},
    max_price: {type: Number},
    destination: {type: String},
    departure_date: {type: Number},
  },
  userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user'},
});

Inspiration.pre('save', function (next) {
  User.findById(this.userId)
    .then(user => {
      user.inspirationId = this._id;
      user.save();
    })
    .then(next)
    .catch(() => next(new Error('Validation Error. Failed to save Inspiration.')));
});

module.exports = mongoose.model('inspirations', Inspiration);
