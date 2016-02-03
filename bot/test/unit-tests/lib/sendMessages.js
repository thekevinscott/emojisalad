'use strict';

const proxyquire = require('proxyquire');
const sinon = require('sinon');
let fn = function() { }
const conf = {
  queues: {
    foo: {
      // url endpoint for the sms service
      send: 'foo'
    }
  }
};

const sendMessages = proxyquire('lib/sendMessages', {
  'lib/concatenateMessages': function(data) {
    return data;
  },
  'config/services': conf,
  request: fn,
});

describe('Send Message', function() {
  it('loads correctly', function() {
    sendMessages.should.be.ok;
  });

  it('should call request with correct payload', function(done) {
    const messages = [
      { protocol: 'foo', body: 'foo', from: 'bar', to: 'baz' },
      { protocol: 'foo', body: 'foo', from: 'bar', to: 'baz', foo:'bar' }
    ];
    fn = function(payload) {
      payload.form.messages.should.deep.equal([
        { body: 'foo', from: 'bar', to: 'baz' },
        { body: 'foo', from: 'bar', to: 'baz' }
      ]);
      done();
    }
    const sendMessages = proxyquire('lib/sendMessages', {
      'lib/concatenateMessages': function(data) {
        return data;
      },
      'config/services': conf,
      request: fn,
    });
    sendMessages(messages);
  });

  describe('Multiple protocols', () => {
    const conf = {
      queues: {
        qux: {
          send: 'qux'
        },
        norf: {
          send: 'norf'
        }
      }
    };

    it('should throw an error if a message lacks a protocol', () => {
      const messages = [
        { body: 'foo', from: 'bar', to: 'baz1' },
      ];
      const sendMessages = proxyquire('lib/sendMessages', {
        'lib/concatenateMessages': function(data) {
          return data;
        },
        'config/services': conf,
        request: function() {} ,
      });
      (function() {
        sendMessages(messages);
      }).should.throw();
    });

    it('should route multiple protocols correctly', (done) => {
      const conf = {
        queues: {
          qux: {
            send: 'qux'
          },
          norf: {
            send: 'norf'
          }
        }
      };
      const messages = [
        { protocol: 'qux', body: 'foo', from: 'bar', to: 'baz1' },
        { protocol: 'norf', body: 'foo', from: 'bar', to: 'baz2', foo:'bar' }
      ];
      let counter = 0;
      fn = function(payload) {
        if ( payload.url === conf.queues.qux.send ) {
          payload.form.messages.should.deep.equal([
            { body: 'foo', from: 'bar', to: 'baz1' },
          ]);
        } else if ( payload.url === conf.queues.norf.send ) {
          payload.form.messages.should.deep.equal([
            { body: 'foo', from: 'bar', to: 'baz2' },
          ]);
        }
        counter++;
        // we have two protocols defined
        if ( counter === 2 ) {
          done();
        }
      }
      const sendMessages = proxyquire('lib/sendMessages', {
        'lib/concatenateMessages': function(data) {
          return data;
        },
        'config/services': conf,
        request: fn,
      });
      sendMessages(messages);
    });
  });
  
  describe('Tripwire', () => {
    const options = {
      'alert': 2,
      'trip': 4,
    };

    const callSendMessages = (number_of_messages, sendAlert) => {
      let messages = [];
      for ( let i = 0; i < number_of_messages; i++ ) {
        messages.push({ protocol: 'foo', body: 'foo', from: 'bar', to: 'baz' });
      }
      fn = function(payload, callback) {
        callback(null, 'its good');
      }
      const sendMessages = proxyquire('lib/sendMessages', {
        'lib/concatenateMessages': function(data) {
          return data;
        },
        'config/services': conf,
        request: fn,
        './sendAlert': sendAlert
      });
      return sendMessages(messages, options);
    }

    describe('Alerts', () => {
      it('should not send an alert if under the alert number', (done) => {
        const fn = sinon.spy();
        callSendMessages(options.alert - 1, fn).then((res) => {
          fn.called.should.equal(false);
          done();
        });
      });
      it('should send an alert if equal to the alert number', (done) => {
        const fn = sinon.spy();
        callSendMessages(options.alert, fn).then((res) => {
          fn.called.should.equal(true);
          done();
        });
      });
      it('should send an alert if over the alert number', (done) => {
        const fn = sinon.spy();
        callSendMessages(options.alert + 1, fn).then((res) => {
          fn.called.should.equal(true);
          done();
        });
      });
    });

    describe('Tripped', () => {
      it('should send an alert and throw if equal to the trip number', () => {
        const fn = sinon.spy();
        (function() {
          callSendMessages(options.trip, fn);
        }).should.throw('Tripwire tripped');
        fn.called.should.equal(true);
      });

      it('should send an alert and throw if over the trip number', () => {
        const fn = sinon.spy();
        (function() {
          callSendMessages(options.trip + 1, fn);
        }).should.throw('Tripwire tripped');
        fn.called.should.equal(true);
      });
    });
  });
});
