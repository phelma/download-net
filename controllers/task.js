var Task = require('../models/task.js');
var User = require('../models/user.js');
var userController = require('../controllers/user.js');

exports.getTask = function(req, res) {
  // Get an unallocated task
  Task
    .findOne()
    .where('status').exists(false)
    .exec(function(err, task) {
      if (err) {
        res.send(err);
        throw err;
      }
      res.json(task);
    });
};

exports.getTaskById = function (req, res) {
  Task.findById(req.params.taskId, function (err, task) {
    if (err) {
      res.json({error: err});
    } else if (!task) {
      res
        .status(404)
        .json({error: 'task not found'});
    } else {
      var user = '';
      if (task.user) {
        User.find({_id: task.user}, function (err, user) {
          res.json({task: task, user:user});
        });
      } else {
        res.json({task: task});
    }}
  });
};

exports.addTask = function(req, res) {
  var task = new Task();

  task.type = req.body.type;
  task.script = req.body.script;
  task.manifest = req.body.manifest;
  task.priority = req.body.priority || 1;

  task.save(function(err) {
    if (err) res.send(err);

    res.json({
      message: 'Added task',
      data: task
    });
  });
};

exports.updateTask = function(req, res) {
  Task.findById(req.params.taskId, function(err, task) {
    if (err) {res.send(err);}

    task.status = req.body.status;
    task.user   = req.body.user;

    if (req.body.status === 'accepted') {
      task.startTime = new Date();
    } else if (req.body.status === 'complete') {
      task.endTime = new Date();
    }

    task.save(function(err) {
      if (err) {res.send(err);}
      // Respond
      res.json({
        message: 'updated',
        task: task
      });
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
