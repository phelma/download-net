'use strict';

var inquirer = require('inquirer');
var request  = require('superagent');
var execute  = require('./execute.js');

var uri = 'http://127.0.0.1:3000';
var retryInterval = 5; //seconds

var username = '';
var userId = '';
var task = {};

var getUsername = function() {
  console.log('Please enter a username');
  inquirer.prompt([{
    type: 'input',
    name: 'username',
    message: 'username',
  }], function(answers) {
    username = answers.username;
    userLogic(answers.username);
  });
};

var userLogic = function(username) {
  checkUser(username, function(resp) {
    if (resp.user) {
      userId = resp.user._id;
      console.log('User ' + resp.user.username + ' exists');
      if (resp.tasks && resp.tasks.length !== 0) {
        console.log('User ' + resp.user.username + ' has ' + resp.tasks.length + ' tasks');
        executeTask(resp.tasks[0]);
      } else {
        console.log('User ' + resp.user.username + ' does not have a task');
        getTask(resp.user.username);
      }
    } else {
      console.log('User ' + username + ' does not exist, creating');
      createUser(username);
    }
  });
};

var checkUser = function(username, callback) {
  console.log('\nChecking user ' + username);
  request
    .get(uri + '/user/' + username)
    .end(function(res) {
      if (!res.body) {
        throw 'no response';
      } else {
        callback(res.body);
      }
    });
};

var createUser = function (username) {
  console.log('Creating user ' + username);
  request
    .post(uri + '/user')
    .type('form')
    .send({username: username})
    .end(function(res) {
      if (res.body.error) {
        throw res.body.error;
      } else {
        getTask(username);
      }
    });
};

var getTask = function(username) {
  console.log('Getting a task for ' + username);
  request
    .get(uri + '/task')
    .end(function(res) {
      if (res.body.error) {
        console.log('Could not get task, probably none avaliable');
        console.log('Try again in ' + retryInterval + 's');
        setTimeout(userLogic, retryInterval * 1000, username);
      } else {
        console.log('Got task: ' + res.body._id);
        task = res.body;
        acceptTask(res.body);
      }
    });
};

var acceptTask = function(task) {
  console.log('Accepting task: ' + task._id);
  request
    .put(uri + '/task/' + task._id)
    .type('form')
    .send({
      status: 'accepted',
      user: userId
    })
    .end(function(res) {
      if (res.body.error) {
        throw res.body.error;
      } else {
        executeTask(task);
      }
    });
};

var executeTask = function(task) {
  console.log('Executing task: ' + task._id);
  console.log(JSON.stringify({task: task}, 0, 2));
  var opts = {
    'manifestUrl': task.manifest,
    'taskLoc'    : task.script,
    'taskName'   : task.type
  };
  execute.downloadAndExecute(opts, taskComplete);

  // console.log('EXECUTING ... TODO, currently just waits 5s');
  // setTimeout(taskComplete, 5000, task);
};

var taskComplete = function() {
  console.log('Task complete:  ' + task._id);
  console.log('Updating task on server');
  request
    .put(uri + '/task/' + task._id)
    .type('form')
    .send({status: 'complete'})
    .end(function(res) {
      if (res.body.error) {
        throw res.body.error;
      } else {
        userLogic(username);
      }
    });
};

getUsername();
