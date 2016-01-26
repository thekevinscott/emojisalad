'use strict';

const proxyquire = require('proxyquire');
const sinon = require('sinon');
let fn = function() { }
const conf = {
  queues: {
    sms: {
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
      { body: 'foo', from: 'bar', to: 'baz' },
      { body: 'foo', from: 'bar', to: 'baz', foo:'bar' }
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
});
