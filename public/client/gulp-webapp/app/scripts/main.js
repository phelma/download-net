'use strict';
(function () {
  if (!console) {
    console = {};
  }
  var old = console.log;
  var logger = document.getElementById('console');
  console.log = function (message) {
    if (typeof message === 'object') {
      logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : String(message)) + '<br />';
    } else {
      logger.innerHTML += message + '<br />';
    }
  };
})();

if (typeof process != 'undefined') {
  console.log('Node version: ' + process.version);
} else {
  console.log('Not using node :/');
}


var fs = require('fs');
var request = require('superagent');

console.log('\ndownload-net client\n');

var serverAddress = process.argv[2] || '127.0.0.1:3000';

console.log('Connecting to ' + serverAddress);

// request
//   .get(serverAddress + '/task')
//   .end(function (err, res) {
//     console.log(res.body);
//   });

// var taskScriptPath = process.argv[2] || './test-script.js';
// var manifestPath   = process.argv[3] || './test-manifest.txt';

// console.log('Task Script  : ' + taskScriptPath);
// console.log('Task Manifest: ' + manifestPath + '\n');

// var taskScript = require(taskScriptPath);

// fs.readFile(manifestPath, function (err, data) {
//   if (err) {throw err;}
//   taskScript.task(data);
// });
