var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
  type     : String,
  script   : String,
  manifest : String,
  status   : String,
  user     : String,
  startTime: Date,
  endTime  : Date,
  priority : Number
});

module.exports = mongoose.model('task', TaskSchema);
