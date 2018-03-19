'use strict';

const mongoose = require('mongoose');

const Inspiration = mongoose.Schema({
    searchResults = {type: String, required: true},
    user = {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user'}
  }, {timestamps: true});

Inspiration.pre('save', function (next) {
  User.findById(this.user)
    .then(user => {
      user.inspiration = this._id;
      user.save();
    })
    .then(next)
    .catch(() => next(new Error('Validation Error. Failed to save Inspiration.')));
});
