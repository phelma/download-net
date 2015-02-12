var fs = require('fs');
var request = require('superagent');

console.log('\ndownload-net client\n');

var serverAddress = process.argv[2] || '127.0.0.1:3000';

console.log('Connecting to ' + serverAddress);

request
  .get(serverAddress + '/task')
  .end(function (err, res) {
    console.log(res.body);
  });

// var taskScriptPath = process.argv[2] || './test-script.js';
// var manifestPath   = process.argv[3] || './test-manifest.txt';

// console.log('Task Script  : ' + taskScriptPath);
// console.log('Task Manifest: ' + manifestPath + '\n');

// var taskScript = require(taskScriptPath);

// fs.readFile(manifestPath, function (err, data) {
//   if (err) {throw err;}
//   taskScript.task(data);
// });
