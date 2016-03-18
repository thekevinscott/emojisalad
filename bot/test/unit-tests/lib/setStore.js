'use strict';

const proxyquire = require('proxyquire');
const sinon = require('sinon');
//const Promise = require('bluebird');

describe('Set Store', () => {
  it('loads correctly', () => {
    const setStore = require('lib/setStore');
    setStore.should.be.ok;
  });

  it('does not set a store for an empty array', () => {
    const spy = sinon.spy();
    const setStore = proxyquire('lib/setStore', {
      store: spy
    });
    setStore([]);
    spy.called.should.equal(false);
  });

  it('sets the correct store of a single message', (done) => {
    const rand = Math.random();
    const setStore = proxyquire('lib/setStore', {
      store: (key, store) => {
        store.should.equal(rand);
        return done();
      }
    });
    return setStore([{
      protocol: 'foo',
      id: rand
    }]);
  });

  it('sets the latest store of an array of messages', (done) => {
    const setStore = proxyquire('lib/setStore', {
      store: (key, store) => {
        store.should.equal(2);
        done();
      }
    });
    return setStore([
      {
        protocol: 'foo',
        id: 1
      },
      {
        protocol: 'foo',
        id: 2
      }
    ]);
  });

  it('sets the latest store of an array of out of order messages', (done) => {
    const setStore = proxyquire('lib/setStore', {
      store: (key, store) => {
        store.should.equal(2);
        done();
      }
    });
    return setStore([
      {
        protocol: 'foo',
        id: 2
      },
      {
        protocol: 'foo',
        id: 1
      }
    ]);
  });
});
