var req = require('./lib/req');
var Message = require('../../../models/Message');
var sprint = require('sprintf');
var Promise = require('bluebird');

module.exports = function(params) {
  var r = {
    q: function() {
      return req.q(null, params);
    },
    p: function(opts) {
      return req.p(opts, params );
    }
  }

  describe('Signup', function() {
    this.timeout(6000);
    it('should reject if no identifier is provided', function() {
      return r.q().then(function(response) {
        params.reject(response);
      });
    });


    describe('Test a brand new user', function() {

      it('should introduce itself when contacting for the first time', function() {
        return Promise.join(
          r.p({
            username: params.getUser(),
            message: 'hello?'
          }),
          Message.get('intro'),
          function(response, message) {
            response[0].should.equal(message.message);
          }
        );
      });

      describe('Saying yes', function() {
        var message;
        before(function() {
          return Message.get('intro_2').then(function(response) {
            message = response.message;
          });
        });

        function sayYes(message) {
          var username = params.getUser();

          return Promise.join(
            r.p({
              username: username,
              message: message
            }),
            Message.get('intro'),
            function(response, message) {
              response[0].should.equal(message.message);
            }
          ).then(function() {
            return r.p({
              username: username,
              message: message 
            });
          });
        }

        it('should start the onboarding with a "yes" response', function() {
          return sayYes('yes').then(function(response) {
            response[0].should.equal(message);
          });
        });
        it('should start the onboarding with a "y" response', function() {
          return sayYes('y').then(function(response) {
            response[0].should.equal(message);
          });
        });
        it('should start the onboarding with a "yea" response', function() {
          return sayYes('yea').then(function(response) {
            response[0].should.equal(message);
          });
        });
        it('should start the onboarding with a "yeah" response', function() {
          return sayYes('yeah').then(function(response) {
            response[0].should.equal(message);
          });
        });
        it('should start the onboarding with a "yeehaw" response', function() {
          return sayYes('yeehaw').then(function(response) {
            params.empty(response);
          });
        });
      });
    });

    it('should prompt the user to invite friends', function() {
      var username = params.getUser();

      return r.p({
        username: username,
        message: 'hi'
      }).then(function(response) {
        return r.p({
          username: username,
          message: 'yes'
        });
      }).then(function(response) {
        return Promise.join(
          r.p({
          username: username,
          message: username // the nickname
        }),
        Message.get('intro_3', username ),
        function(response, message) {
          response[0].should.equal(message.message);
        }
        );
      });
    });

    it('should blacklist a new user who messages accidentally', function() {
      var username = params.getUser();
      return r.p({
        username: username,
        message: 'hi'
      }).then(function() {
        return r.p({
          username: username,
          message: 'no'
        });
      }).then(function() {
        // so, in this case, we just shut up entirely
        return r.p({
          username: username,
          message: 'hello?'
        });
      }).then(function(response) {
        params.empty(response);
      });
    });

    it('should chide a user who tries to invite users before entering a nickname', function() {
      var username = params.getUser();
      return r.p({
        username: username,
        message: 'hi'
      }).then(function() {
        return r.p({
          username: username,
          message: 'yes'
        });
      }).then(function() {
        return Promise.join(
          r.p({
          username: username,
          message: 'invite foo'
        }),
        Message.get('wait-to-invite'),
        function(response, message) {
          response[0].should.equal(message.message);
        }
        );
      });
    });
  });

  describe('Invite flow', function() {
    this.timeout(6000);
    var inviter = params.getUser();
    before(function() {
      return r.p({
        username: inviter,
        message: 'hi'
      }).then(function() {
        return r.p({
          username: inviter,
          message: 'yes'
        });
      }).then(function() {
        return r.p({
          username: inviter,
          message: inviter // the nickname
        });
      });
    });

    it('should get pissy if you don\'t send it a valid invite message', function() {
      return Promise.join(
        r.p({
          username: inviter,
          message: 'random foo'
        }),
        Message.get('wtf'),
        function(response, message) {
          response[0].should.equal(message.message);
        }
      );
    });

  });
}
