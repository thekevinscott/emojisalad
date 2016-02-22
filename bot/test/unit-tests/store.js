'use strict';

const proxyquire = require('proxyquire');
const sinon = require('sinon');
const Promise = require('bluebird');
const store = require('store');

describe('Store', () => {
  it('loads correctly', () => {
    store.should.be.ok;
  });

  it('stores and gets a brand new key', () => {
    const id = 'foo'+Math.random();
    const val = 'bar'+Math.random();
    return store(id, val).then(() => {
      return store(id);
    }).then((result) => {
      result.should.equal(val);
    });
  });

  it('stores and gets an existing key', () => {
    const id = 'foo'+Math.random();
    const val = 'bar'+Math.random();
    return store(id, 'foo').then(() => {
      return store(id, val);
    }).then(() => {
      return store(id);
    }).then((result) => {
      result.should.equal(val);
    });
  });

});
