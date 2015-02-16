var User = require('../models/user.js');

exports.addUser = function(username, cb) {
  var user = new User();

  user.username = username;
  user.save(function(err) {
    if (err) {throw err;}
    cb(user);
  });
};

exports.getUserId = function(username, cb) {
  User.find({ username: username }, function(err, user) {
    if (err || !user.id) { cb(false); }
    else {cb(user.id)};
  });
};

exports.getUserTask = function (id) {
  User.findById(id, function(err, user){
    if(err){return err;}
    return user.accepted;
  });
};

exports.allocateTask = function(username, taskId) {
  User.find({ username: username }, function(err, user) {
    if (err) {
      throw 'Error user not found: ' + err;
    }
    user.accepted = taskId;

    user.save(function(err) {
      if (err) {
        throw 'Error could not save: ' + err;
      }
    });
  });
};

exports.taskComplete = function(username, taskId) {
  User.find({ username: username }, function(err, user) {
    if (err) {
      throw 'Error user not found: ' + err;
    }
    user.accepted = '';
    user.complete.push(taskId);

    user.save(function(err) {
      if (err) {
        throw 'Error could not save: ' + err;
      }
    });
  });
};

exports.getAllUsers = function(req, res) {
  User.find(function(err, users) {
    if (err) res.send(err);

    res.json(users);
  });
};

exports.deleteAllUsers = function(req, res) {
  User.remove(function(err) {
    if (err) res.send(err);

    res.json({
      'message': 'all users deleted :/'
    });
  });
};
