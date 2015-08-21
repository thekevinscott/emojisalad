var should = require('chai').should();
var expect = require('chai').expect;
var _ = require('lodash');
var req = require('./suite/lib/req');
var Promise = require('bluebird');
var Message = require('../../models/Message');

describe('Twilio', function() {
  // MOVE THIS TO THE WEB TESTS
  describe('Phone Numbers', function() {
    describe('Invalid', function() {
      it('should reject a string', function() {
      });
      //'foo'
      // 555-555-5555
      // 123123
    });

    it('should accept valid phone numbers', function() {
    });
  });
  var params = {
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
  };
  require('./suite')(params);
  describe('Invite flow', function() {

    this.timeout(6000);
    var inviter = params.getUser();
    before(function() {
      return req.p({
        username: inviter,
        message: 'hi'
      }, params).then(function() {
        return req.p({
          username: inviter,
          message: 'yes'
        }, params);
      }).then(function() {
        return req.p({
          username: inviter,
          message: inviter // the nickname
        }, params);
      });
    });
    describe('Invalid Phone Numbers', function() {
      it('should reject a nothing string', function() {
        return Promise.join(
          req.p({
            username: inviter,
            message: 'invite'
          }, params),
          Message.get('error-8'),
          function(response, message) {
            response[0].should.equal(message.message);
          }
        );
      });
      it('should reject a nothing string', function() {
        return Promise.join(
          req.p({
            username: inviter,
            message: 'invite '
          }, params),
          Message.get('error-8'),
          function(response, message) {
            response[0].should.equal(message.message);
          }
        );
      });
      it('should reject a string as number', function() {
        return Promise.join(
          req.p({
            username: inviter,
            message: 'invite foo'
          }, params),
          Message.get('error-1'),
          function(response, message) {
            response[0].should.equal(message.message);
          }
        );
      });
      it('should reject a short number', function() {
        return Promise.join(
          req.p({
            username: inviter,
            message: 'invite 860460'
          }, params),
          Message.get('error-1'),
          function(response, message) {
            response[0].should.equal(message.message);
          }
        );
      });
    });
    describe('Valid numbers', function() {
      it('should be able to invite someone', function() {
        var num = getRand();
        return Promise.join(
          req.p({
            username: inviter,
            message: 'invite '+num
          }, params),
          Message.get('intro_4', { args: [{pattern: num} ] }),
          function(response, message) {
            //response[0].should.equal(message.message);
          }
        );
      });

      it('should not be able to re-invite someone', function() {
        return;
        this.timeout(10000);
        var num = getRand();
        var msg = 'invite '+num;
        return req.p({
          username: inviter,
          message: 'invite '+num
        }, params).then(function() {
          return Promise.join(
            req.p({
              username: inviter,
              message: num
            }, params),
            Message.get('error-2', num),
            function(response, message) {
              console.log('THIS TEST IS WRONG ***** Figure out how to strip invite');
              response[0].should.equal(message.message);
            }
          );
        }).then(function() {
          return Promise.join(
            req.p({
              username: inviter,
              message: 'invite '+num
            }, params),
            Message.get('error-2', num),
            function(response, message) {
              response[0].should.equal(message.message);
            }
          );
        });
      });

      it('should not be able to invite someone on do-not-call-list', function() {
        return;
        /*
        this.timeout(10000);
        var num = getRand();
        var msg = 'invite '+num;
        return req.p({
          username: inviter,
          message: 'invite '+num
        }, params).then(function() {
          return Promise.join(
            req.p({
              username: inviter,
              message: num
            }, params),
            Message.get('error-2', num),
            function(response, message) {
              console.log('THIS TEST IS WRONG ***** Figure out how to strip invite');
              response[0].should.equal(message.message);
            }
          );
        }).then(function() {
          return Promise.join(
            req.p({
              username: inviter,
              message: 'invite '+num
            }, params),
            Message.get('error-2', num),
            function(response, message) {
              response[0].should.equal(message.message);
            }
          );
        });
        */
      });
    });
  });
});

function getRand() {
  return '860460'+Math.floor(1000 + Math.random() * 9000);
}
