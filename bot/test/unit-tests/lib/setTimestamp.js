'use strict';

const proxyquire = require('proxyquire');
const sinon = require('sinon');
const Promise = require('bluebird');

describe('Set Timestamp', function() {
  it('loads correctly', function() {
    const setTimestamp = require('lib/setTimestamp');
    setTimestamp.should.be.ok;
  });

  it('does not set a timestamp for an empty array', function() {
    let spy = sinon.spy();
    const setTimestamp = proxyquire('lib/setTimestamp', {
      store: spy
    });
    setTimestamp([]);
    spy.called.should.equal(false);
  });

  it('sets the correct timestamp of a single message', function(done) {
    const ts = new Date();
    const setTimestamp = proxyquire('lib/setTimestamp', {
      store: Promise.coroutine(function* (key, timestamp) {
        timestamp.should.equal(ts);
        return done();
      })
    });
    return setTimestamp([{
      timestamp: ts
    }]);
  });

  it('sets the latest timestamp of an array of messages', function(done) {
    const ts = '2015-01-01 10:00:00';
    const setTimestamp = proxyquire('lib/setTimestamp', {
      store: Promise.coroutine(function* (key, timestamp) {
        timestamp.should.equal(ts);
        done();
      })
    });
    return setTimestamp([
      {
        timestamp: '2014-01-01 10:00:00'
      },
      {
        timestamp: ts
      }
    ]);
  });

  it('sets the latest timestamp of an array of out of order messages', function(done) {
    const ts = '2015-01-01 10:00:00';
    const setTimestamp = proxyquire('lib/setTimestamp', {
      store: Promise.coroutine(function* (key, timestamp) {
        timestamp.should.equal(ts);
        done();
      })
    });
    return setTimestamp([
      {
        timestamp: '2014-01-01 10:00:00'
      },
      {
        timestamp: ts
      },
      {
        timestamp: '2013-01-01 10:00:00'
      },
    ]);
  });

  it('sets the latest timestamp with millisecond precision', function(done) {
    const ts = '2015-12-25 23:33:48.482396';
    const setTimestamp = proxyquire('lib/setTimestamp', {
      store: Promise.coroutine(function* (key, timestamp) {
        timestamp.should.equal(ts);
        done();
      })
    });
    return setTimestamp([
      {
        timestamp: ts
      },
      {
        timestamp: '2015-12-25 23:33:48.482395'
      },
    ]);
  });

  it('handles dates with periods in them', function(done) {
    const ts = '2015.12.25 23:33:48';
    const setTimestamp = proxyquire('lib/setTimestamp', {
      store: Promise.coroutine(function* (key, timestamp) {
        timestamp.should.equal(ts);
        done();
      })
    });
    return setTimestamp([
      {
        timestamp: ts
      },
      {
        timestamp: '2015.12.24 23:33:48'
      },
    ]);
  });

  it('should set timestamp if given a raw timestamp', (done) => {
    const ts = (new Date()).getTime() / 1000;
    const setTimestamp = proxyquire('lib/setTimestamp', {
      store: Promise.coroutine(function* (key, timestamp) {
        timestamp.should.equal(ts);
        done();
      })
    });
    return setTimestamp(ts);
  });
});
