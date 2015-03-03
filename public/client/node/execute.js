'use strict';
// Deps
var npm     = require('npm');
var request = require('request');
var path    = require('path');
var fs      = require('fs');
var mkdirp  = require('mkdirp');

module.exports.downloadAndExecute = function (opts, callback) {
  var opts = opts || {};
  var manifestUrl      = opts.manifestUrl;
  var manifestFileName = path.basename(manifestUrl); // e.g. 'test-manifest-2'
  var manifestDir      = path.basename(manifestFileName, path.extname(manifestFileName)); // e.g. 'test-manifest'
  var taskLoc          = opts.taskLoc;
  var taskName         = opts.taskName;

  var ensureDirs = function (dirsArray) {
    dirsArray.forEach(function (item) {
      mkdirp.sync(item);
    });
  };

  var downloadManifest = function () {
    mkdirp.sync('manifests'); // ensure manifests dir exists

    var ws = fs
      .createWriteStream('manifests' + path.sep + manifestFileName)
      .on('finish', downloadTask);

    // Download the file
    request(manifestUrl).pipe(ws);
  };

  var downloadTask = function (err) {
    if (err) {console.log ('Error: ' + err);}
    // load npm
    npm.load(null, function () {
      console.log('npm ls');
      npm.commands.ls(['parseable'], function (data) {
        console.log(data);
        console.log('Listed?');
        console.log('NPM update ' + taskLoc);
        npm.commands.install([taskLoc], execute);
      });
    });
  };

  var execute = function (err) {
    if (err) {console.log ('Error: ' + err);}

    // load the *newly downloaded* task package
    console.log('Loading task: ' + taskName);
    var task = require(taskName);

    // Execute the urlDownload
    var inFile = path.join('manifests', manifestFileName);
    var outDir = path.join('output', taskName, manifestDir);

    mkdirp(outDir); // ensure outDir dir exists
    console.log('Executing task: ' + task + ', with manifest: ' + inFile + ', to: ' + outDir);
    task.executeTask(inFile, outDir, callback);
  };
  downloadManifest();
};

// module.exports.downloadAndExecute();
