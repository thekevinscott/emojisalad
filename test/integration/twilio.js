var should = require('chai').should();
var expect = require('chai').expect;
var _ = require('lodash');

describe('Twilio', function() {
  describe('should handle phone numbers of different styles', function() {
    it('should reject invalid phone numbers', function() {
      //'foo'
      // 555-555-5555
      // 123123
    });
  });
  require('./suite')({
    url: '/platform/twilio',
    
    // TEST CALLBACKS

    // callback for a test that passes no data
    reject: function(response) {
      response[0].should.contain('You must provide a phone');
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
  });
});

function getRand() {
  return '860460'+Math.floor(1000 + Math.random() * 9000);
}
