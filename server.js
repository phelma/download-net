// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var env = process.env.NODE_ENV || 'development';
var config = require('./config.js')[env];

var taskController = require('./controllers/task.js');

// Connect to DB
mongoose.connect(config.db);

// Create our Express application
var app = express();
app.set('port', config.port || 3000);

app.use(bodyParser.urlencoded({
  extended: true
}));

// Create our Express router
var router = express.Router();

// Initial dummy route for testing
// http://localhost:3000/api
router.route('/task')
  .get(taskController.getTask)
  .post(taskController.addTask);

router.route('/task/:taskId')
  .get(taskController.getTaskById)
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

router.route('/all')
  .get(taskController.getAllTasks)
  .delete(taskController.deleteAllTasks);

// Register all our routes with /api
app.use('/', router);

app.use(express.static(__dirname + '/public'));

// Start the server
app.listen(app.get('port'));
console.log('download-net server listening on port: ' + app.get('port'));

// export for testing
exports = module.exports = app
