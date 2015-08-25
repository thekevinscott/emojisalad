var should = require('chai').should();
var expect = require('chai').expect;
var _ = require('lodash');
var req = require('./suite/lib/req');
var Promise = require('bluebird');
var Message = require('../../models/Message');

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
  require('./suite')(params);
  describe('Invite flow', function() {

    this.timeout(10000);
    var inviter = '+1'+params.getUser(); // add a +1 to simulate twilio
    before(function() {
      return signUp(inviter);
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
        var num = '+1'+getRand();
        return Promise.join(
          req.p({
            username: inviter,
            message: 'invite '+num,
          }, params, true),
          Message.get('intro_4', num),
          Message.get('invite', inviter),
          function(output, message, introMessage) {
            output.Response.Message[0].should.equal(message.message);
            output.Response.Sms[0]['_'].should.equal(introMessage.message);
            output.Response.Sms[0]['$']['to'].should.equal(num);
            // from is actually our config number. I don't think we need to test that.
            //output.Response.Sms[0]['$']['from'].should.equal(inviter);
          }
        );
      });

      it('should not be able to re-invite someone', function() {
        var num = '+1'+getRand();
        return req.p({
          username: inviter,
          message: 'invite '+num,
        }, params).then(function() {
          return Promise.join(
            req.p({
              username: inviter,
              message: 'invite '+num,
            }, params, true),
            Message.get('error-2', num),
            function(output, message) {
              output.Response.Message[0].should.equal(message.message);
              // from is actually our config number. I don't think we need to test that.
              //output.Response.Sms[0]['$']['from'].should.equal(inviter);
            }
          );
        });
      });

      it('should not be able to invite someone on do-not-call-list', function() {
        var num = '+1'+getRand();
        return req.p({
          username: inviter,
          message: 'invite '+num,
        }, params).then(function() {
          return req.p({
            username: num,
            message: 'do not text me again!!!!!!k'
          }, params);
        }).then(function() {
          return Promise.join(
            req.p({
              username: inviter,
              message: 'invite '+num,
            }, params, true),
            Message.get('error-3', num),
            function(output, message) {
              output.Response.Message[0].should.equal(message.message);
              // from is actually our config number. I don't think we need to test that.
              //output.Response.Sms[0]['$']['from'].should.equal(inviter);
            }
          );
        });
      });
    });

    describe('Invited User Onboarding', function() {
      var inviter = '+1'+params.getUser(); // add a +1 to simulate twilio
      inviter = '+18604609999'; // number doign the inviting
      before(function() {
        return signUp(inviter);
      });

      it('should be able to onboard an invited user', function() {
        var num = '+1'+getRand();
        num = '+18604601111' // number to invite
        return req.p({
          username: inviter,
          message: 'invite '+num,
        }, params).then(function(response) {
          return Promise.join(
            req.p({
              username: num,
              message: 'yes'
            }, params),
            Message.get('intro_2'),
            function(response, message) {
              response[0].should.equal(message.message);
            }
          );
        }).then(function() {
          return Promise.join(
            req.p({
              username: num,
              message: num 
            }, params, true),
            Message.get('game-on'),
            Message.get('accepted', num),
            function(output, message, acceptedMessage) {
              output.Response.Message[0].should.equal(message.message);
              output.Response.Sms[0]['_'].should.equal(acceptedMessage.message);
              output.Response.Sms[0]['$']['to'].should.equal(inviter);
            }
          );
        });
      });
    });
  });
});

function getRand() {
  return '860460'+Math.floor(1000 + Math.random() * 9000);
}

function signUp(number) {
  // set up a new user
  return req.p({
    username: number,
    message: 'hi'
  }, params).then(function() {
    return req.p({
      username: number,
      message: 'yes'
    }, params);
  }).then(function() {
    return req.p({
      username: number,
      message: number // the nickname
    }, params);
  });
}
