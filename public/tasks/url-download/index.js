'use strict';
var fs = require('fs'),
    request = require('request');
    // log = require('loglevel');
// var urlList = 'https://raw.githubusercontent.com/phelma/bulk-downloader/master/head100.txt';

// log.setLevel('warn');




var tsvJSON = function (tsv, headers, callback) {
  var result = [];
  var lines = tsv.split('\n');
  var headers = headers || lines[0].split('\t');

  var obj = {};
  var currentLine = [];
  for (var i = 1; i< lines.length - 1; i++) {
    currentLine = lines[i].split('\t');
    result.push({
      "filename": currentLine[0],
      "url": currentLine[1]
    });
  }
  callback(result);
};

fs.readFile('head100.txt', 'utf8', function (err, data) {
  if (err) throw err;
  // console.log(data);

  var headers = ['filename', 'url'];
  tsvJSON(data, headers, function (result) {
    result.forEach(function (item) {
      saveFile(item);
    });
  });

});

var saveFile = function (params) {
  console.log('Requesting: ' + params.filename +'.jpg' + '\tfrom: ' + params.url);
  request
    .get({
      url: params.url,
      timeout: 10000
    })
    .on('response', function (resp) {
      if (resp.statusCode === 200 && resp.headers['content-type'] === 'image/jpeg') {
        resp.pipe(fs.createWriteStream('out/' + params.filename + '.jpg'));
      } else {
        console.log(JSON.stringify({
          'Error': 'Could not download',
          'file': params.filename,
          'url': params.url,
          'statusCode': resp.statusCode,
          'content-type': resp.headers['content-type'],
        }, 0, 2));
      }
    })
    .on('error', function (err) {
      console.log(JSON.stringify({
          'Error': err,
          'file': params.filename,
          'url': params.url
        }, 0 , 2));
    });
};
