'use strict';

const proxyquire = require('proxyquire');
const sinon = require('sinon');
const Promise = require('bluebird');

describe('Set Store', function() {
  it('loads correctly', function() {
    const setStore = require('lib/setStore');
    setStore.should.be.ok;
  });

  it('does not set a store for an empty array', function() {
    let spy = sinon.spy();
    const setStore = proxyquire('lib/setStore', {
      store: spy
    });
    setStore([]);
    spy.called.should.equal(false);
  });

  it('sets the correct store of a single message', function(done) {
    const ts = new Date();
    const setStore = proxyquire('lib/setStore', {
      store: Promise.coroutine(function* (key, store) {
        store.should.equal(ts);
        return done();
      })
    });
    return setStore([{
      store: ts
    }]);
  });

  it('sets the latest store of an array of messages', function(done) {
    const ts = '2015-01-01 10:00:00';
    const setStore = proxyquire('lib/setStore', {
      store: Promise.coroutine(function* (key, store) {
        store.should.equal(ts);
        done();
      })
    });
    return setStore([
      {
        store: '2014-01-01 10:00:00'
      },
      {
        store: ts
      }
    ]);
  });

  it('sets the latest store of an array of out of order messages', function(done) {
    const ts = '2015-01-01 10:00:00';
    const setStore = proxyquire('lib/setStore', {
      store: Promise.coroutine(function* (key, store) {
        store.should.equal(ts);
        done();
      })
    });
    return setStore([
      {
        store: '2014-01-01 10:00:00'
      },
      {
        store: ts
      },
      {
        store: '2013-01-01 10:00:00'
      },
    ]);
  });

  it('sets the latest store with millisecond precision', function(done) {
    const ts = '2015-12-25 23:33:48.482396';
    const setStore = proxyquire('lib/setStore', {
      store: Promise.coroutine(function* (key, store) {
        store.should.equal(ts);
        done();
      })
    });
    return setStore([
      {
        store: ts
      },
      {
        store: '2015-12-25 23:33:48.482395'
      },
    ]);
  });

  it('handles dates with periods in them', function(done) {
    const ts = '2015.12.25 23:33:48';
    const setStore = proxyquire('lib/setStore', {
      store: Promise.coroutine(function* (key, store) {
        store.should.equal(ts);
        done();
      })
    });
    return setStore([
      {
        store: ts
      },
      {
        store: '2015.12.24 23:33:48'
      },
    ]);
  });

  it('should set store if given a raw store', (done) => {
    const ts = (new Date()).getTime() / 1000;
    const setStore = proxyquire('lib/setStore', {
      store: Promise.coroutine(function* (key, store) {
        store.should.equal(ts);
        done();
      })
    });
    return setStore(ts);
  });
});
