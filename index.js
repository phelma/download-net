// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fileListController = require('./controllers/filelist.js');

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Connect to DB
mongoose.connect('mongodb://localhost:27017/download-net');

// Create our Express application
var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

// Create our Express router
var router = express.Router();

// Initial dummy route for testing
// http://localhost:3000/api
router.route('/fileList')
  .post(fileListController.postFileList)
  .get(fileListController.getNewFileList)
  .put(fileListController.updateFileList)
  .delete(fileListController.deleteFileList);

router.route('/all')
  .get(fileListController.getAllFileLists)
  .delete(fileListController.deleteAllFileLists);

// Register all our routes with /api
app.use('/', router);

// Start the server
app.listen(port);
console.log('Listening on port: ' + port);

