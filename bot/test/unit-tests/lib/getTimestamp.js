'use strict';
const should = require('chai').should();

const proxyquire = require('proxyquire');
const sinon = require('sinon');
const Promise = require('bluebird');

describe('Get Timestamp', function() {
  it('loads correctly', function() {
    const getTimestamp = require('lib/getTimestamp');
    getTimestamp.should.be.ok;
  });

  it('gets the stored timestamp', function(done) {
    const ts = new Date();
    const getTimestamp = proxyquire('lib/getTimestamp', {
      store: Promise.coroutine(function* (key) {
        return ts.getTime() / 1000 ;
      })
    });
    getTimestamp(20).then(function(result) {
      should.equal(closeEnough(result, ts.getTime() / 1000), true);
      done();
    });
  });

  it('should return a timestamp at specified runtime if no timestamp is stored', function(done) {
    const getTimestamp = proxyquire('lib/getTimestamp', {
      store: Promise.coroutine(function* (key) {
        return null;
      })
    });
    const runtime = 30;
    getTimestamp(runtime).then(function(result) {
      let expectedDate = (new Date());
      expectedDate.setSeconds(expectedDate.getSeconds() - runtime);
      should.equal(closeEnough(result, expectedDate.getTime() / 1000), true);
      done();
    });
  });

  it('should not return a timestamp earlier than a specified runtime', function(done) {
    const getTimestamp = proxyquire('lib/getTimestamp', {
      store: Promise.coroutine(function* (key) {
        return new Date('1/1/2016');
      })
    });
    const runtime = 30;
    getTimestamp(runtime).then(function(result) {
      let expectedDate = (new Date());
      expectedDate.setSeconds(expectedDate.getSeconds() - runtime);
      //console.log(result);
      //console.log(expectedDate);
      should.equal(closeEnough(result, expectedDate.getTime() / 1000), true);
      done();
    });
  });

  it('should not return a timestamp earlier than a specified runtime', function(done) {
    let expectedDate = (new Date());
    expectedDate.setSeconds(expectedDate.getSeconds() - 10);
    const getTimestamp = proxyquire('lib/getTimestamp', {
      store: Promise.coroutine(function* (key) {
        return expectedDate.getTime() / 1000;
      })
    });
    getTimestamp(600).then(function(result) {
      should.equal(closeEnough(result, expectedDate.getTime() / 1000), true);
      done();
    });
  });
});

function closeEnough(a, b) {
  const allowedOffset = 2;
  return Math.abs(a - b) < allowedOffset;
}
