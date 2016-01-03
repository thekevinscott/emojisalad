'use strict';

const proxyquire = require('proxyquire');
const sinon = require('sinon');
const conf = {
  queues: {
    sms: {
      // url endpoint for the sms service
      received: 'foo'
    }
  }
};
let getMessages = require('lib/getMessages');

describe('Get Messages', function() {
  it('loads correctly', function() {
    getMessages.should.be.ok;
  });

  it('makes a call to request with the correct parameters', function() {
    let fn = sinon.spy();

    let getMessages = proxyquire('lib/getMessages', {
      request: fn,
      'config/services': conf
    });
    getMessages();
    fn.called.should.equal(true);
  });

  it('should parse the response', function() {

    var resp = { foo: 'bar' };
    let getMessages = proxyquire('lib/getMessages', {
      request: function(error, callback) {
        callback(null, {
          body: JSON.stringify(resp)
        });
      },
      'config/services': conf
    });
    return getMessages().then(function(r) {
      r.should.deep.equal(resp);
    });
  });

  it('should gracefully handle already parsed response', function() {

    var resp = { foo: 'bar' };
    let getMessages = proxyquire('lib/getMessages', {
      request: function(error, callback) {
        callback(null, {
          body: resp
        });
      },
      'config/services': conf
    });
    return getMessages().then(function(r) {
      r.should.deep.equal(resp);
    });
  });
});
