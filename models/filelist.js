var mongoose = require('mongoose');

var FileListSchema = new mongoose.Schema({
  index      : Number,
  url: {
    type     : String,
    required : true,
    unique   : true
  },
  firstSynset: String,
  alphaIndex : String,
  status     : String,
  user       : String
});

module.exports = mongoose.model('fileList', FileListSchema);
