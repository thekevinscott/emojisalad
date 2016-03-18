'use strict';

const Promise = require('bluebird');
const proxyquire = require('proxyquire');
const _ = require('lodash');
//const sinon = require('sinon');

process.env.PROTOCOLS = '';

const prom = (data) => {
  return new Promise((resolve) => {
    resolve(data);
  });
};

const getRead = (obj = {}) => {
  const passThru = (data) => {
    return prom(data);
  };
  return proxyquire('lib/read', _.assign({}, {
    'lib/getMessages': () => {
      return prom([]);
    },
    'lib/processMessage': passThru,
    'lib/sendMessages': passThru,
    'lib/setTimestamp': passThru,
    'lib/getTimestamp': () => { return prom(Math.random());}
  }, obj));
};

describe('read', () => {
  it('runs its script when called', (done) => {
    const read = getRead();
    read().finally(() => {
      done();
    });
  });

  it('should prevent multiple calls at once', (done) => {
    let processing = 0;
    let complete = false;
    const getMessages = () => {
      return new Promise((resolve) => {
        processing.should.equal(0);
        processing++;

        setTimeout(() => {
          processing.should.equal(1);
          processing--;
          complete = true;
          resolve([]);
        }, 100);
      });
    };

    const read = getRead({
      'lib/getMessages': getMessages
    });

    read();
    read().finally(() => {
      complete.should.equal(true);
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

  it('should spin up multiple times if no messages are found', () => {
    let processing = 0;
    const read = getRead({
      'lib/getMessages': () => {
        return new Promise((resolve) => {
          processing++;
          resolve([]);
        });
      }
    });

    return read().then(() => {
      return read();
    }).finally(() => {
      processing.should.equal(2);
    });
  });

  it('should filter out any undefined messages back from processed messages', () => {
    let found_messages;
    const read = getRead({
      'lib/getMessages': () => {
        return prom([1, 2]);
      },
      'lib/processMessage': (message) => {
        if ( message === 1 ) {
          return prom('foo');
        } else {
          return prom();
        }
      },
      'lib/sendMessages': (messages) => {
        found_messages = messages;
        return prom();
      }
    });

    return read().finally(() => {
      found_messages.length.should.equal(1);
    });
  });

});
