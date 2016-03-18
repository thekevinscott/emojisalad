'use strict';

const proxyquire = require('proxyquire');
const sinon = require('sinon');
const _ = require('lodash');
const registry = (options = {} ) => {
  return {
    get: () => {
      return {
        api: {
          received: {
            endpoint: options.received || 'foo',
            method: 'GET'
          },
          send: {
            endpoint: options.send || 'bar',
            method: 'POST'
          }
        }
      };
    }
  };
};
const getMessages = proxyquire('lib/getMessages', {
  'microservice-registry' : registry()
});

describe('Get Messages', () => {
  it('loads correctly', () => {
    getMessages.should.be.ok;
  });

  it('should throw an error without a timestamp', () => {
    const fn = sinon.spy();
    const getMessages = proxyquire('lib/getMessages', {
      request: fn
    });
    (getMessages).should.throw();
  });

  it('should throw an error with an invalid timestamp', () => {
    const fn = sinon.spy();
    const getMessages = proxyquire('lib/getMessages', {
      request: fn
    });
    (function() { getMessages('foo'); }).should.throw();
  });

  it('should do nothing for an empty queues object', () => {
    const fn = sinon.spy();

    const getMessages = proxyquire('lib/getMessages', {
      //request: fn,
    });
    return getMessages(Math.random(), []).then((res) => {
      res.length.should.equal(0);
      fn.called.should.equal(false);
    });
  });

  it('should make a call to request with correct parameters and get back response', () => {
    const received = 'foo'+Math.random();
    const timestamp = Math.random();
    const returned = [{ body: 'foo' }];
    const conf = {
      queues: {
        foobar: {
          received
        }
      }
    };

    const getMessages = proxyquire('lib/getMessages', {
      'microservice-registry': registry({ received }),
      request: (options, callback) => {
        options.should.deep.equal({
          url: received,
          method: 'GET',
          qs: {
            id: timestamp
          }
        });
        callback(null, { body: JSON.stringify(returned) });
      },
      'config/services': conf
    });
    return getMessages({ foobar: timestamp }, ['foobar']).then((res) => {
      returned[0].protocol = 'foobar';
      res.should.deep.equal(returned);
    });
  });

  it('should gracefully handle already parsed response', () => {
    const received = 'foo'+Math.random();
    const timestamp = Math.random();
    const returned = [{ body: 'foo' }];
    const conf = {
      queues: {
        foobar: {
          received
        }
      }
    };

    const getMessages = proxyquire('lib/getMessages', {
      'microservice-registry': registry(),
      request: (options, callback) => {
        callback(null, { body: returned });
      },
      'config/services': conf
    });
    return getMessages({ foobar: timestamp }, ['foobar']).then((res) => {
      res.should.deep.equal(returned);
    });
  });

  it('should concat multiple queues together', () => {
    const received = [
      'foo'+Math.random(),
      'foo'+Math.random()
    ];
    const timestamp = Math.random();
    const returned = [
      [{ body: Math.random(), from: Math.random() }],
      [{ body: Math.random(), from: Math.random() }]
    ];
    const conf = {
      queues: {
        foo: {
          received: received[0]
        },
        bar: {
          received: received[1]
        }
      }
    };

    const getMessages = proxyquire('lib/getMessages', {
      'microservice-registry': {
        get: (protocol) => {
          const body = (index) => {
            return {
              api: {
                received: {
                  endpoint: received[index],
                  method: 'GET'
                }
              }
            };
          };

          let index;
          if (protocol === 'foo' ) {
            index = 0;
          } else {
            index = 1;
          }

          return body(index);
        }
      },
      request: (options, callback) => {
        if ( options.url === received[0] ) {
          callback(null, { body: returned[0] });
        } else {
          callback(null, { body: returned[1] });
        }
      },
      'config/services': conf
    });
    return getMessages({ foo: timestamp, bar: timestamp }, ['foo','bar']).then((res) => {
      res.length.should.equal(2);
      res[0].should.deep.equal(_.assign({}, returned[0][0], { protocol: 'foo' }));
      res[1].should.deep.equal(_.assign({}, returned[1][0], { protocol: 'bar' }));
    });
  });

  describe('Tripwire', () => {
    const options = {
      'alert': 2,
      'trip': 4
    };

    function callGetMessages(number_of_messages, sendAlert) {
      const received = 'foo'+Math.random();
      const timestamp = Math.random();
      const returned = [];
      for ( let i = 0; i < number_of_messages; i++ ) {
        returned.push({ body: 'foo' + Math.random() });
      }
      const conf = {
        queues: {
          foobar: {
            received
          }
        }
      };

      const getMessages = proxyquire('lib/getMessages', {
        'microservice-registry': registry(),
        request: (options, callback) => {
          callback(null, { body: returned });
        },
        'config/services': conf,
        './sendAlert': sendAlert
      });

      return getMessages({ foobar: timestamp }, ['foobar'], options);
    }

    describe('Alerts', () => {
      it('should not send an alert if under the alert number', () => {
        const fn = sinon.spy();
        return callGetMessages(options.alert - 1, fn).then(() => {
          fn.called.should.equal(false);
        });
      });
      it('should send an alert if equal to the alert number', () => {
        const fn = sinon.spy();
        return callGetMessages(options.alert, fn).then(() => {
          fn.called.should.equal(true);
        });
      });
      it('should send an alert if over the alert number', () => {
        const fn = sinon.spy();
        return callGetMessages(options.alert + 1, fn).then(() => {
          fn.called.should.equal(true);
        });
      });
    });

    describe('Tripped', () => {
      it('should send an alert and throw if equal to the trip number', () => {
        const fn = sinon.spy();
        return callGetMessages(options.trip, fn).catch((err) => {
          fn.called.should.equal(true);
          err.should.contain('Tripwire tripped');
        });
      });
      it('should send an alert and throw if over the trip number', () => {
        const fn = sinon.spy();
        return callGetMessages(options.trip + 1, fn).catch((err) => {
          fn.called.should.equal(true);
          err.should.contain('Tripwire tripped');
        });
      });
    });
  });
});
