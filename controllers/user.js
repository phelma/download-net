var User = require('../models/user.js');
var Task = require('../models/task.js');

exports.getUser = function (req, res) {
  User.findOne({username: req.params.username}, function (err, user) {
    if (err) {
      res.json({error: err});
    } else if (!user) {
      res
        .status(404)
        .json({error: 'user not found'});
    } else {
      Task.findOne({user: user._id}, function (err, task) {
        if (err) {console.log('error, could not find task for that user, ');}
        var userTask = task || {};
        res.json({user: user, task: userTask});
      });
    }
  });
};

exports.addUser = function(req, res) {
  var user = new User();
  user.username = req.body.username;
  user.save(function(err) {
    if (err) {res.send(err);}
    res.json({message: 'user added', user: user});
  });
};

exports.deleteUser = function (req, res) {
  User.findOneAndRemove({username: req.params.username}, function(err, user){
    if (err) {res.send(err);}
    res.json({message: 'user deleted', user: user});
  });
};

exports.getAllUsers = function(req, res) {
  User.find(function(err, users) {
    if (err) {res.send(err);}
    res.json(users);
  });
};

exports.deleteAllUsers = function(req, res) {
  User.remove(function(err) {
    if (err) {res.send(err);}
    res.json({
      'message': 'all users deleted :/'
    });
  });
};
