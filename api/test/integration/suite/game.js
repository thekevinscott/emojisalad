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
    var JURASSIC_PARK = '⏰🐲🐊🐉   🌳🌳🌳';
    var MIXED_EMOJI = '😀😀😀😀foo🚀🚀🚀🚀' ;
    var numbers = [];
    this.timeout(15000);

    it('should initiate the game with the person who started it', function() {
      var users = getUsers();
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

    it('should get pissy if you try and send nothing as a clue', function() {
      var users = getUsers();

      return startGame(users).then(function() {
        return Promise.join(
          req.p({
            username: users.inviter.number,
            message: '' 
          }, params),
          function(response) {
            response[0].should.equal('You must provide a message');
          }
        );
      });
    });

    it('should get pissy if you try and send a non-emoji clue', function() {
      var users = getUsers();

      return startGame(users).then(function() {
        return Promise.join(
          req.p({
            username: users.inviter.number,
            message: MIXED_EMOJI
          }, params),
          Message.get('error-9'),
          function(response, message) {
            response[0].should.equal(message.message);
          }
        );
      });
    });

    it('should forward the submission to other players', function() {
      var users = getUsers();

      return startGame(users).then(function() {
        var msg = JURASSIC_PARK;
        return Promise.join(
          req.p({
            username: users.inviter.number,
            message: msg
          }, params, true),
          Message.get('game-submission-sent'),
          Message.get('says', [users.inviter.username, msg]),
          Message.get('guessing-instructions'),
          function(output, message, forwardedMessage, guessingInstructions) {
            output.Response.Message[0].should.equal(message.message);
            var saySMS = output.Response.Sms[0];
            saySMS['_'].should.equal(forwardedMessage.message);
            saySMS['$']['to'].should.equal(users.invited.number);
            var instructionsSMS = output.Response.Sms[1];
            instructionsSMS['_'].should.equal(guessingInstructions.message);
            instructionsSMS['$']['to'].should.equal(users.invited.number);
          }
        );
      });
    });

    it('should allow other players to cross talk', function() {
      var users = getUsers();
      var msg = 'The fuck is that?';

      return startGame(users).then(function() {
        return req.p({
          username: users.inviter.number,
          message: JURASSIC_PARK 
        }, params, true);
      }).then(function() {
        return Promise.join(
          req.p({
            username: users.invited.number,
            message: msg
          }, params, true),
          Message.get('says', [users.invited.username, msg]),
          function(output, message) {
            console.log('output', output);
            var saySMS = output.Response.Sms[0];
            saySMS['_'].should.equal(message.message);
            saySMS['$']['to'].should.equal(users.inviter.number);
          }
        );
      });
    });

    it.only('should allow other players to guess', function() {
      var users = getUsers();
      var msg = 'Jurassic Park';

      return startGame(users).then(function() {
        return req.p({
          username: users.inviter.number,
          message: JURASSIC_PARK 
        }, params, true);
      }).then(function() {
        return Promise.join(
          req.p({
            username: users.invited.number,
            message: msg
          }, params, true),
          Message.get('correct-guess', [users.invited.username]),
          function(output, message) {
            console.log('output', output);
            var saySMS = output.Response.Sms[0];
            saySMS['_'].should.equal(message.message);
            saySMS['$']['to'].should.equal(users.inviter.number);
          }
        );
      });
    });

    it('should not allow the submitter to guess for their own submission', function() {
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

  function getUsers() {
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

    return users;
  }
}
