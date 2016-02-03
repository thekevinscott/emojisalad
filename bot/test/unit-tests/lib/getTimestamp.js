'use strict';
const should = require('chai').should();

const proxyquire = require('proxyquire');
const sinon = require('sinon');
const Promise = require('bluebird');

describe('Get Timestamp', () => {
  it('loads correctly', () => {
    const getTimestamp = require('lib/getTimestamp');
    getTimestamp.should.be.ok;
  });

  it('gets the stored timestamp', (done) => {
    const ts = new Date();
    const getTimestamp = proxyquire('lib/getTimestamp', {
      store: (key) => {
        return new Promise((resolve) => {
          return resolve(ts.getTime() / 1000);
        });
      }
    });
    getTimestamp().then(function(result) {
      result.should.equal(ts.getTime() / 1000);
      done();
    });
  });

  it('should use now if no timestamp is stored', (done) => {
    const getTimestamp = proxyquire('lib/getTimestamp', {
      store: (key) => {
        return new Promise((resolve) => {
          return resolve();
        });
      }
    });

    getTimestamp().then(function(result) {
      let expectedDate = (new Date());
      should.equal(closeEnough(result, expectedDate.getTime() / 1000), true);
      done();
    });
  });
});

function closeEnough(a, b) {
  const allowedOffset = 2;
  return Math.abs(a - b) < allowedOffset;
}
