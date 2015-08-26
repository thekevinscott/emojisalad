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

  describe('Game', function() {
    var numbers = [];
    this.timeout(10000);
    beforeEach(function() {
    });

    it.only('the person who initiated the game will start it', function() {
      var inviter = {
        number: '+1'+params.getUser(), // add a +1 to simulate twilio
        username: 'Inviting User'
      };
      var invited = {
        number: '+1'+params.getUser(), // add a +1 to simulate twilio
        username: 'Invited User'
      }

      var users = {
        inviter: inviter,
        invited: invited
      };

      var phrase = 'JURASSIC PARK';
      return Promise.join(
        startGame(users),
        Message.get('game-start', [users.inviter.username, phrase]),
        function(output, gameStartMessage) {
          var Sms = output.Response.Sms[1];
          Sms['_'].should.equal(gameStartMessage.message);
          Sms['$']['to'].should.equal(users.inviter.number);
          return output;
        }
      );
    });
  });

  function signUp(user) {
    // set up a new user
    return req.p({
      username: user.number,
      message: 'hi'
    }, params).then(function() {
      return req.p({
        username: user.number,
        message: 'yes'
      }, params);
    }).then(function() {
      return req.p({
        username: user.number,
        message: user.username // the nickname
      }, params);
    });
  }

  function startGame(users) {
    return signUp(users.inviter).then(function() {
      return req.p({
        username: users.inviter.number,
        message: 'invite '+users.invited.number,
      }, params);
    }).then(function(response) {
      return req.p({
        username: users.invited.number,
        message: 'yes'
      }, params);
    }).then(function(response) {
      return req.p({
        username: users.invited.number,
        message: users.invited.username 
      }, params, true);
    });
  }
}
