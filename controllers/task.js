var Task = require('../models/task.js');

// /task GET
exports.getTask = function(req, res) {
  Task
    .find()
    .where('status').exists(false)
    .limit(1)
    .exec(function(err, task) {
      if (err) res.send(err);

      res.json(task);
    });
};

exports.getTaskById = function (req, res) {
  Task
    .findById(req.params.taskId, function (err, task) {
      if (err) {
        res
          .status(404)
          .send(err);
      };
      res.json(task);
    });
};

// /task POST
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
      message: 'Added',
      data: task
    });
  });
};

// /task PUT
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

// /task DELETE
exports.deleteTask = function(req, res) {
  Task.findByIdAndRemove(req.params.taskId || req.body.id, function(err) {
    if (err) res.send(err);

    res.json({
      message: 'deleted ' + (req.params.taskId || req.body.id)
    });
  });
};

// /all GET
exports.getAllTasks = function(req, res) {
  Task.find(function(err, task) {
    if (err) res.send(err);

    res.json(task);
  });
};

// /all DELETE
exports.deleteAllTasks = function(req, res) {
  Task.remove(function(err) {
    if (err) res.send(err);

    res.json({
      'message': 'all deleted :/'
    });
  });
};
