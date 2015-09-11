var should = require('chai').should();
var expect = require('chai').expect;
var _ = require('lodash');
var req = require('./lib/req');
var Promise = require('bluebird');
var Message = require('../../models/Message');

var params = {
  url: '/platform/twilio',
  
  // TEST CALLBACKS

  // callback for a test that passes no data
  reject: function(response) {
    should.equal(response, undefined);
  },
  // callback to test for an empty response
  empty: function(response) {
    expect(response).to.be.an('undefined');
  },
  // callback for a test that passes data
  accept: function(response) {
    return Promise.resolve(response[0]);
  },

  getUser: function() {
    return getRand();
  },
  userKey: 'From',
  messageKey: 'Body'
};

describe('Twilio', function() {
  this.timeout(10000);
  require('./suite')(params);
});

function getRand() {
  return '860460'+Math.floor(1000 + Math.random() * 9000);
}
