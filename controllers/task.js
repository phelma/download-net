var Task = require('../models/task.js');
var userController = require('../controllers/user.js');

exports.getTask = function(req, res) {
  // Get an unallocated task
  // TODO priorise

  var username = req.query.username;
  var userId   = userController.getUserId(username) || userController.addUser(username).data._id;
  var userTask = userController.getUserTask(userId);

  if (!userTask){
    Task
      .find()
      .where('status').exists(false)
      .limit(1)
      .exec(function(err, task) {
        if (err) {
          res.send(err);
          throw err;
        }
        userTask = task.id;
      });
  }

  res.json(userTask);
};

exports.getTaskById = function (req, res) {
  Task
    .findById(req.params.taskId, function (err, task) {
      if (err) {
        res
          .status(404)
          .send(err);
      }
      res.json(task);
    });
};

exports.addTask = function(req, res) {
  // Create new list instance
  var task = new Task();

  // Set the properties from the POST
  task.type = req.body.type;
  task.script = req.body.script;
  task.manifest = req.body.manifest;
  task.priority = req.body.priority || 1;

  // Save
  task.save(function(err) {
    if (err) res.send(err);

    res.json({
      message: 'Added task',
      data: task
    });
  });
};

exports.updateTask = function(req, res) {
  Task.findById(req.params.taskId || req.body.id, function(err, task) {
    if (err) res.send(err);

    // Update the task
    task.status = req.body.status;
    task.user = req.body.user;

    if (req.body.status === 'accepted') {
      task.startTime = new Date();
    } else if (req.body.status === 'complete') {
      task.endTime = new Date();
    }

    task.save(function(err) {
      if (err) res.send(err);
    });

    // Respond
    res.json({
      message: 'updated'
    });
  });
};

exports.deleteTask = function(req, res) {
  Task.findByIdAndRemove(req.params.taskId || req.body.id, function(err) {
    if (err) res.send(err);

    res.json({
      message: 'deleted ' + (req.params.taskId || req.body.id)
    });
  });
};

exports.getAllTasks = function(req, res) {
  Task.find(function(err, tasks) {
    if (err) res.send(err);

    res.json(tasks);
  });
};

exports.deleteAllTasks = function(req, res) {
  Task.remove(function(err) {
    if (err) res.send(err);

    res.json({
      'message': 'all tasks deleted :/'
    });
  });
};
