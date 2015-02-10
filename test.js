var assert = require('chai').assert,
  expect = require('chai').expect,
  should = require('chai').should;
var request = require('request');
var supertest = require('supertest');
var api = supertest('http://localhost:3000');

describe('Warm up', function() {
  it('should pass this one easily', function(done) {
    assert.equal(true, true);
    done();
  });
  it('shouldn\'t fail this one', function(done) {
    assert.equal(true, !false);
    done();
  });
});

describe('download-net', function() {
  describe('/all', function () {
    it('DELETE', function (done) {
      api
        .delete('/all')
        .expect(200)
        .expect('{"message":"all deleted :/"}', done);
    });
    it('GET', function (done) {
      api
        .get('/all')
        .expect(200)
        .expect('[]', done);
    });
  });
  describe('/fileList', function () {
    it('POST', function (done) {
      api
        .post('/fileList')
        .type('form')
        .send({url: 'http://www.my.test.url.com/is-here.txt'})
        .send({firstSynset: 'n00000001'})
        .send({alphaIndex: 'aa'})
        .expect(200, done);
    });
    it('GET', function (done) {
      api
        .get('/fileList')
        .expect(200)
        .end(function(err, res){
          if (err) {return done(err);}
          // console.log(res);
          console.log(res.body);
          // console.log(JSON.parse(res.body));
          console.log(lengthOf(JSON.parse(res.body)));
          assert.lengthOf(JSON.parse(res.body), 1);
          done();
        });
    });
    it('POST second', function (done) {
      api
        .post('/fileList')
        .type('form')
        .send({url: 'http://www.my.other.test.url.com/is-here.txt'})
        .send({firstSynset: 'n00000002'})
        .send({alphaIndex: 'ab'})
        .expect(200, done);
    });
    it('GET still gives one response', function (done) {
      api
        .get('/fileList')
        .expect(200)
        .end(function(err, res){
          if (err) {return done(err);}
          assert.lengthOf(JSON.parse(res.body), 1);
          done();
        });
    });
    it('/all GET gives 2 responses', function (done) {
      api
        .get('/fileList')
        .expect(200)
        .end(function(err, res){
          if (err) {return done(err);}
          assert.lengthOf(JSON.parse(res.body), 2);
          done();
        });
    });
  });
});
