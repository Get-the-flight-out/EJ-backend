'use strict';

const mongoose = require('mongoose');
const User = require('./user');

const Inspiration = mongoose.Schema({
  searchResults: {type: String, required: true},
  _timestamp: {type: Date},
  userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user'},
});

Inspiration.pre('save', function (next) {
  console.log('PRE:', this.userId);
  console.log('USER:', this.User);
  User.findById(this.userId)
    .then(user => {
      console.log('USER:', user);
      console.log('THIS:', this._id);
      user.inspiration = this._id;
      user.save();
    })
    .then(next)
    .catch(() => next(new Error('Validation Error. Failed to save Inspiration.')));
});

module.exports = mongoose.model('inspirations', Inspiration);
