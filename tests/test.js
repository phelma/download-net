var assert = require('chai').assert,
  expect = require('chai').expect,
  should = require('chai').should;
var request = require('supertest');
var supertest = require('supertest');
// var api = supertest('http://localhost:3000');

var acceptedTaskId = '';

var app = require('../server.js');
var api = request.agent(app);

describe('download-net', function() {
  describe('Empty', function() {
    it('/all DELETE', function(done) {
      api
        .delete('/all')
        .expect(200)
        .expect('{"message":"all deleted :/"}', done);
    });
    it('/all GET', function(done) {
      api
        .get('/all')
        .expect(200)
        .expect('[]', done);
    });
  });
  describe('Add tasks', function() {
    it('/task POST a file list', function(done) {
      api
        .post('/task')
        .type('form')
        .send({
          type: 'test',
          script: '/public/tasks/test-script.txt',
          manifest: '/public/manifests/test-manifest.txt'
        })
        .expect(200, done);
    });
    it('/all GET one file list', function(done) {
      api
        .get('/all')
        .expect(200)
        .end(function(err, res) {
          assert.lengthOf(res.body, 1);
          done();
        });
    });
    it('/task POST another file list', function(done) {
      api
        .post('/task')
        .type('form')
        .send({
          type: 'test',
          script: '/public/tasks/test-script.txt',
          manifest: '/public/manifests/test-manifest-2.txt'
        })
        .expect(200, done);
    });
    it('/task GET one file list', function(done) {
      api
        .get('/task')
        .expect(200)
        .end(function(err, res) {
          assert.lengthOf(res.body, 1);
          acceptedTaskId = res.body[0]._id;
          done();
        });
    });
    it('/all GET two file lists', function(done) {
      api
        .get('/all')
        .expect(200)
        .end(function(err, res) {
          assert.lengthOf(res.body, 2);
          done();
        });
    });
  });
  describe('Set task status', function() {
    it('/task PUT accepted', function(done) {
      api
        .put('/task/' + acceptedTaskId)
        .type('form')
        .send({
          status: 'accepted'
        })
        .send({
          user: 'test'
        })
        .expect(200, done);
    });
    it('/task/:taskId GET shows accepted status', function(done) {
      api
        .get('/task/' + acceptedTaskId)
        .expect(200)
        .end(function(err, res) {
          assert.equal(res.body._id, acceptedTaskId);
          assert.equal(res.body.status, 'accepted');
          done();
        });
    });
    it('/task GET doesn\'t return accepted task', function(done) {
      api
        .get('/task')
        .expect(200)
        .end(function(err, res) {
          assert.notEqual(res.body[0]._id, acceptedTaskId);
          done();
        });
    });
    it('/task PUT complete', function(done) {
      api
        .put('/task/' + acceptedTaskId)
        .type('form')
        .send({
          id: acceptedTaskId
        })
        .send({
          status: 'complete'
        })
        .send({
          user: 'test'
        })
        .expect(200, done);
    });
    it('/task/:taskId GET shows complete status', function(done) {
      api
        .get('/task/' + acceptedTaskId)
        .expect(200)
        .end(function(err, res) {
          assert.equal(res.body._id, acceptedTaskId);
          assert.equal(res.body.status, 'complete');
          done();
        });
    });
    it('/task GET doesn\'t return comleted task', function(done) {
      api
        .get('/task')
        .expect(200)
        .end(function(err, res) {
          assert.notEqual(res.body[0]._id, acceptedTaskId);
          done();
        });
    });
    it('/all GET two file lists', function(done) {
      api
        .get('/all')
        .expect(200)
        .end(function(err, res) {
          assert.lengthOf(res.body, 2);
          done();
        });
    });
  });
  describe('Delete task', function() {
    it('/task/:taskId DELETE', function (done) {
      api
        .delete('/task/' + acceptedTaskId)
        .expect(200)
        .expect('{"message":"deleted ' + acceptedTaskId + '"}', done);
    });
    it('task is deleted', function (done) {
      api
      .get('/task/' + acceptedTaskId)
      .expect(201, done)
    });
    it('task is deleted', function (done) {
      api
        .get('/all')
        .expect(200)
        .end(function(err, res) {
          assert.lengthOf(res.body, 1);
          done();
        });
    });
  });
});
