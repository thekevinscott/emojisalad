'use strict';

const proxyquire = require('proxyquire');
const sinon = require('sinon');
const Promise = require('bluebird');
const store = require('store');

describe('Store', function() {
  it('loads correctly', function() {
    store.should.be.ok;
  });

  it('stores and gets a brand new key', function() {
    const id = 'foo'+Math.random();
    const val = 'bar'+Math.random();
    return store(id, val).then(function() {
      return store(id);
    }).then(function(result) {
      result.should.equal(val);
    });
  });

  it('stores and gets an existing key', function() {
    const id = 'foo'+Math.random();
    const val = 'bar'+Math.random();
    return store(id, 'foo').then(function() {
      return store(id, val);
    }).then(function() {
      return store(id);
    }).then(function(result) {
      result.should.equal(val);
    });
  });

});
