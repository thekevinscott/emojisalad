var expect = require('chai').expect;

var getUsers = require('../lib/getUsers');
var setup = require('../lib/setup');
var check = require('../lib/check');
var signup = require('../flows/signup');

describe('Inviter flow', function() {
  var users = getUsers(2);
  var inviter = users[0];
  before(function() {
    return signup(inviter);
  });

  describe.only('Invalid Phone Numbers', function() {
    it('should reject an invalid invite phrase', function() {
      return check(
        { user: inviter, msg: 'foobar' },
        [{ key: 'error-8', to: inviter }]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should reject a nothing string', function() {
      return check(
        { user: inviter, msg: 'invite' },
        [{ key: 'error-8', to: inviter }]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should reject a nothing string, this time with white space', function() {
      return check(
        { user: inviter, msg: 'invite ' },
        [{ key: 'error-8', to: inviter }]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should reject a string as number', function() {
      return check(
        { user: inviter, msg: 'invite foo' },
        [{ key: 'error-1', options: ['foo'], to: inviter }]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should reject a short number', function() {
      return check(
        { user: inviter, msg: 'invite 860460' },
        [{ key: 'error-1', options: ['860460'], to: inviter }]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  describe('Valid numbers', function() {
    this.timeout(10000);
    it('should be able to invite someone', function() {
      var num = '+1'+getRand();
      return Promise.join(
        req.p({
          username: inviter,
          message: 'invite '+num,
        }, true),
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

    it('should be able to invite a formatted number', function() {
      var end = Math.floor(1000 + Math.random() * 9000);
      var num = '+1860460'+end;
      return Promise.join(
        req.p({
          username: inviter,
          message: 'invite (860) 460-'+end,
        }, true),
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
      }).then(function() {
        return Promise.join(
          req.p({
            username: inviter,
            message: 'invite '+num,
          }, true),
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
      }).then(function() {
        return req.p({
          username: num,
          message: 'do not text me again!!!!!!k'
        });
      }).then(function() {
        return Promise.join(
          req.p({
            username: inviter,
            message: 'invite '+num,
          }, true),
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
});

/*
describe('Invited User Onboarding', function() {
  var inviter = '+1'+params.getUser(); // add a +1 to simulate twilio
  var inviterName = 'Inviting User';
  before(function() {
    return signUp(inviter, inviterName);
  });

  it('should be able to onboard an invited user', function() {
    var num = '+1'+getRand();
    var invitedName = 'Invited User';
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
          message: invitedName 
        }, params, true),
        Message.get('accepted-inviter', [invitedName, inviterName]),
        Message.get('accepted-invited', invitedName),
        function(output, messageInviter, messageInvited) {
          output.Response.Message[0].should.equal(messageInviter.message);
          output.Response.Sms[0]['_'].should.equal(messageInvited.message);
          output.Response.Sms[0]['$']['to'].should.equal(inviter);
        }
      );
    });
  });
});
*/
