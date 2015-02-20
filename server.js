// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var env = process.env.NODE_ENV || 'development';
var config = require('./config.js')[env];

var taskController = require('./controllers/task.js');
var userController = require('./controllers/user.js');

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

// ROUTES
router.route('/task')
  .get(taskController.getTask)
  .post(taskController.addTask);

router.route('/task/all')
  .get(taskController.getAllTasks)
  .delete(taskController.deleteAllTasks);

router.route('/task/:taskId')
  .get(taskController.getTaskById)
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

router.route('/user')
  .post(userController.addUser);

router.route('/user/all')
  .get(userController.getAllUsers)
  .delete(userController.deleteAllUsers);

router.route('/user/:username')
  .get(userController.getUser)
  .delete(userController.deleteUser);

router.route('/');

// Register all our routes with /
app.use('/', router);

// public directory for client
app.use(express.static(__dirname + '/public'));

// Start the server
app.listen(app.get('port'));
console.log('download-net server listening on port: ' + app.get('port'));

// export for testing
exports = module.exports = app;
