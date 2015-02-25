'use strict';
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  acceptedTask: String,
  completedTasks: Array
});

module.exports = mongoose.model('user', UserSchema);
