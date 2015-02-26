'use strict';
// Config
var timeout = 4000; // ms
var paralell = 70;
var inFile = 'head1k.txt';

// Requirements
var fs = require('fs');
var events = require('events');

// NPM Requirements
var request = require('request');

// Globals
var ee = new events.EventEmitter();
var createdDirs = [];
var filesArray = [];

var counter = {
  // Keep track of things
  count: 0,
  complete: 0,
  errors: 0,
  log: [],
  request: function (filename) {
    this.count ++;
    this.log.push({type: 'request', filename: filename});
    ee.emit('count');
  },
  response: function (filename) {
    this.complete ++;
    this.log.push({type: 'response', filename: filename});
    ee.emit('count');
  },
  error: function (filename) {
    this.errors ++;
    this.log.push({type: 'error', filename: filename});
    ee.emit('count');
  },
  active: function () {
    return this.count - (this.complete + this.errors);
  },
  batch: 0,
  batchUp: function () {
    this.batch ++;
  }
};

// Converts tsv to JSON
var tsvJSON = function (tsv, headers) {
  var lines = tsv.split('\n');
  var headers = headers || lines[0].split('\t');

  var obj = {};
  var currentLine = [];
  for (var i = 1; i< lines.length - 1; i++) {
    currentLine = lines[i].split('\t');
    filesArray.push({
      'filename': currentLine[0],
      'url': currentLine[1]
    });
  }
  ee.emit('count');
};

// cuts off the next avaliable batch and calls getSaveFile() on them
var getNextBatch = function(){
  console.log('Active: ' + counter.active());
  console.log('Started: ' + counter.count + ', Complete: ' + counter.complete + ', Errors: ' + counter.errors);
  if (counter.active() === 0) {
    // var start = counter.batch * paralell;
    // var end   = start + paralell - 1;
    // console.log('Batch from: ' + start + ' end: ' + end);
    // console.log('Filesarray.length: ' + filesArray.length);
    var batchList = filesArray.splice(0, paralell);
    // console.log('BatchList.length: ' + batchList.length);
    console.log('Batch ' + counter.batch);
    var t = 0;
    batchList.forEach(function (item) {
      setTimeout(getSaveFile, t++ * 50, item);
      // getSaveFile(item);
    });
    counter.batchUp();
  }
};

// Requests URL and saves the file
var getSaveFile = function (params) {
  console.log('Requesting: ' + params.filename +'.jpg' + '\tfrom: ' + params.url);
  counter.request(params.filename);
  request
    .get({
      url: params.url,
      timeout: timeout
    })
    .on('response', function (resp) {
      if (resp.statusCode === 200 && resp.headers['content-type'] === 'image/jpeg') {
        saveResp(resp, params);
      } else {
        console.log(JSON.stringify({
          'Error': 'Could not download',
          'file': params,
          'statusCode': resp.statusCode,
          'content-type': resp.headers['content-type'],
        }, 0, 2));
        counter.error(params.filename);
      }
    })
    .on('error', function (err) {
      console.log(JSON.stringify({
          'Error': err,
          'file': params
        }, 0 , 2));
      counter.error(params.filename);
    });
};

// Saves a HTTP response to disk
var saveResp = function (resp, params) {
  // Check and create dir if necessary
  var dirName = params.filename.substring(0,9);
  if (createdDirs.indexOf(dirName) === -1) {
    try {
      createdDirs.push(dirName);
      fs.mkdirSync('out/' + dirName);
    } catch (e) {
      console.log("Error: " + e);
    }
  }
  // writestream
  var wstream = fs
    .createWriteStream('out/' + dirName + '/' + params.filename + '.jpg')
    .on('error', function (err) {
      console.log('ERROR: ' + err);
      resp.read();
    })
    .on('finish', function () {
      counter.response();
    });
  resp.pipe(wstream);
};

// Read the file
fs.readFile(inFile, 'utf8', function (err, data) {
  if (err) throw err;
  var headers = ['filename', 'url'];
  tsvJSON(data, headers);
});

ee.on('count', getNextBatch);
