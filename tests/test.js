'use strict';
var assert    = require('chai').assert,
    expect    = require('chai').expect,
    should    = require('chai').should();
var request   = require('supertest');

var acceptedTaskId = '';
var userId = '';

var app = require('../server.js');
var api = request.agent(app);

describe('download-net', function() {
  describe('Empty tasks & users', function() {
    it('/task/all DELETE', function(done) {
      api
        .delete('/task/all')
        .expect(200)
        .expect('{"message":"all tasks deleted :/"}', done);
    });

    it('/task/all GET', function(done) {
      api
        .get('/task/all')
        .expect(200)
        .expect('[]', done);
    });

    it('/user/all DELETE', function(done) {
      api
        .delete('/user/all')
        .expect(200)
        .expect('{"message":"all users deleted :/"}', done);
    });

    it('/user/all GET', function(done) {
      api
        .get('/user/all')
        .expect(200)
        .expect('[]', done);
    });
  });

  describe('Add tasks', function() {
    it('/task POST a task', function(done) {
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

    it('/task/all GET one task', function(done) {
      api
        .get('/task/all')
        .expect(200)
        .end(function(err, res) {
          assert.lengthOf(res.body, 1);
          done();
        });
    });

    it('/task POST another task', function(done) {
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

    it('/task/all GET two tasks', function(done) {
      api
        .get('/task/all')
        .expect(200)
        .end(function(err, res) {
          assert.lengthOf(res.body, 2);
          done();
        });
    });
  });

  describe('Add users', function() {
    it('/user/:username GET user testuser1 doesn\'t exist', function (done) {
      api
        .get('/user/testuser1')
        .expect(404, done);
    });

    it('/user POST', function(done) {
      api
        .post('/user')
        .type('form')
        .send({
          username: 'testuser1'
        })
        .expect(200, done);
    });

    it('/user/all GET 1 user', function (done) {
      api
        .get('/user/all')
        .expect(200)
        .end(function(err, res){
          assert.lengthOf(res.body, 1);

          done();
        });
    });

    it('/user POST', function(done) {
      api
        .post('/user')
        .type('form')
        .send({
          username: 'testuser2'
        })
        .expect(200, done);
    });

    it('/user/all GET 2 users', function (done) {
      api
        .get('/user/all')
        .expect(200)
        .end(function(err, res){
          assert.lengthOf(res.body, 2);
          done();
        });
    });

    it('/user/:username GET user testuser1', function (done) {
      api
        .get('/user/testuser1')
        .expect(200)
        .end(function (err, res) {
          userId = res.body.user._id;
          done();
        });
    });
  });

  describe('Get task', function() {
    it('/task GET one file list', function(done) {
      api
        .get('/task')
        .expect(200)
        .end(function(err, res) {
          acceptedTaskId = res.body._id;
          assert.isDefined(res.body._id);

          done();
        });
    });

    it('/task/all GET two file lists', function(done) {
      api
        .get('/task/all')
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
          user: userId
        })
        .expect(200)
        .end(function (err, res) {
          done();
        });
    });

    it('/task/:taskId GET shows accepted status', function(done) {
      api
        .get('/task/' + acceptedTaskId)
        .expect(200)
        .end(function(err, res) {
          assert.equal(res.body.task._id, acceptedTaskId);
          assert.equal(res.body.task.status, 'accepted');
          done();
        });
    });

    it('/user/:username GET shows task', function (done) {
      api
        .get('/user/testuser1')
        .expect(200)
        .end(function (err, res) {
          assert.equal(res.body.tasks[0].user, userId);
          done();
        });
    });

    it('/task GET doesn\'t return accepted task', function(done) {
      api
        .get('/task/testuser4')
        .expect(200)
        .end(function(err, res) {
          assert.notEqual(res.body._id, acceptedTaskId);
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
          user: userId
        })
        .expect(200, done);
    });

    it('/task/:taskId GET shows complete status', function(done) {
      api
        .get('/task/' + acceptedTaskId)
        .expect(200)
        .end(function(err, res) {
          assert.equal(res.body.task._id, acceptedTaskId);
          assert.equal(res.body.task.status, 'complete');
          done();
        });
    });

    it('/task GET doesn\'t return completed task', function(done) {
      api
        .get('/task')
        .query({username: 'testuser4'})
        .expect(200)
        .end(function(err, res) {
          assert.notEqual(res.body._id, acceptedTaskId);
          done();
        });
    });

    it('/task/all GET two file lists', function(done) {
      api
        .get('/task/all')
        .expect(200)
        .end(function(err, res) {
          assert.lengthOf(res.body, 2);
          done();
        });
    });
  });

  describe('Delete task', function() {
    it('/task/:taskId DELETE', function(done) {
      api
        .delete('/task/' + acceptedTaskId)
        .expect(200)
        .expect('{"message":"deleted ' + acceptedTaskId + '"}', done);
    });

    it('task is deleted', function(done) {
      api
        .get('/task/' + acceptedTaskId)
        .expect(404, done);
    });

    it('task is deleted', function(done) {
      api
        .get('/task/all')
        .expect(200)
        .end(function(err, res) {
          assert.lengthOf(res.body, 1);
          done();
        });
    });
  });

  describe('Delete users', function() {
    it('/user/:username DELETE', function (done) {
      api
        .delete('/user/testuser1')
        .expect(200, done);
    });

    it('/user/all GET only 1 user left', function (done) {
      api
        .get('/user/all')
        .expect(200)
        .end(function (req, res) {
          assert.equal(res.body.length, 1);
          done();
        });
    });
  });
});
