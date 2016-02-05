'use strict';

const Promise = require('bluebird');
const proxyquire = require('proxyquire');
const _ = require('lodash');
const sinon = require('sinon');

process.env.QUEUES = '';

const prom = (data) => {
  return new Promise(function(resolve) {
    resolve(data);
  });
}

const getRead = (obj = {}) => {
  const passThru = (data) => {
    return prom(data);
  }
  return proxyquire('lib/read', _.assign({}, {
    'lib/getMessages': function(player, body, to) {
      return prom(player);
    },
    'lib/processMessage': passThru,
    'lib/sendMessages': passThru,
    'lib/setTimestamp': passThru,
    'lib/getTimestamp': function() { return prom(Math.random())},
  }, obj));
}

describe('read', function() {
  it('runs its script when called', (done) => {
    const read = getRead();
    read().finally(() => {
      done();
    });
  });
  it('should prevent multiple calls at once', (done) => {
    let processing = 0;
    const getMessages = () => {
      return new Promise((resolve) => {
        processing.should.equal(0);
        processing++;
        console.log('should wait');

        setTimeout(() => {
          processing.should.equal(1);
          processing--;
          console.log('should proceed');
          resolve([]);
        }, 100);
      });
    }
    const read = getRead({
      'lib/getMessages': getMessages
    });

    read();
    read().finally(() => {
      done();
    });
  });

  it('should queue up multiple calls into a single call', (done) => {
    const read = getRead({
      'lib/getMessages': () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([]);
          }, 100);
        });
      }
    });
    let processing = 0;
    let triggered;
    const read_queued = getRead({
      'lib/getMessages': () => {
        return new Promise((resolve) => {
          if ( triggered ) {
            processing.should.equal(1);
          } else {
            processing.should.equal(0);
          }
          triggered = true;
          processing++;
          console.log('should wait');

          setTimeout(() => {
            resolve([]);
          }, 100);
        });
      }
    });

    read();
    read_queued();
    read_queued().finally(() => {
      done();
    });
  });
});
