'use strict';

const proxyquire = require('proxyquire');
const sinon = require('sinon');
const Promise = require('bluebird');

describe.only('Get Timestamp', function() {
  it('loads correctly', function() {
    const getTimestamp = require('lib/getTimestamp');
    getTimestamp.should.be.ok;
  });

  it('gets the stored timestamp', function(done) {
    const ts = new Date();
    const getTimestamp = proxyquire('lib/getTimestamp', {
      store: Promise.coroutine(function* (key) {
        return ts.getTime();
      })
    });
    getTimestamp(20).then(function(result) {
      result.should.equal(ts.getTime());
      done();
    });
  });

  it('should not return a timestamp earlier than a specified runtime', function(done) {
    const getTimestamp = proxyquire('lib/getTimestamp', {
      store: Promise.coroutine(function* (key) {
        return new Date('1/1/2000');
      })
    });
    const runtime = 30;
    let expectedDate = (new Date());
    expectedDate.setSeconds(expectedDate.getSeconds() - runtime);
    getTimestamp(runtime).then(function(result) {
      result.should.equal(expectedDate.getTime());
      done();
    });
  });

  it('should not return a timestamp earlier than a specified runtime', function(done) {
    let expectedDate = (new Date());
    expectedDate.setSeconds(expectedDate.getSeconds() - 10);
    const getTimestamp = proxyquire('lib/getTimestamp', {
      store: Promise.coroutine(function* (key) {
        return expectedDate.getTime();
      })
    });
    getTimestamp(600).then(function(result) {
      result.should.equal(expectedDate.getTime());
      done();
    });
  });
});
