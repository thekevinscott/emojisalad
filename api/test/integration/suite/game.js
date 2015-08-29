var req = require('./lib/req');
var Message = require('../../../models/Message');
var Game = require('../../../models/Game');
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
    var SILENCE_OF_THE_LAMBS = '🙊  🐑       🔪🔫';
    var numbers = [];
    this.timeout(30000);

    it.only('should initiate the game with the person who started it', function() {
      var users = getUsers();
      var phrase = 'JURASSIC PARK';

      return Promise.join(
        startGame(users),
        function(output, gameStartMessage) {
          return Game.get(users).then(function(game) {
            var submitting_user_id = game.round.submitter_id;
            var submitting_user;
            game.players.map(function(player) {
              if ( player.id === submitting_user_id ) {
                submitting_user = player;
              }
            });

            return Message.get('game-start', [submitting_user.nickname, phrase]).then(function(gameStartMessage) {
              var Sms = output.Response.Sms[1];
              Sms['_'].should.equal(gameStartMessage.message);
              Sms['$']['to'].should.equal(submitting_user.number);
              return output;
            });
          });
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
      var msg2 = 'Shut up and guess';

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
            var saySMS = output.Response.Sms[0];
            saySMS['_'].should.equal(message.message);
            saySMS['$']['to'].should.equal(users.inviter.number);
          }
        );
      }).then(function() {
        return Promise.join(
          req.p({
            username: users.inviter.number,
            message: msg2
          }, params, true),
          Message.get('says', [users.inviter.username, msg2]),
          function(output, message) {
            var saySMS = output.Response.Sms[0];
            saySMS['_'].should.equal(message.message);
            saySMS['$']['to'].should.equal(users.invited.number);
          }
        );
      });
    });

    it('should allow other players to guess', function() {
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
            var saySMS = output.Response.Sms[0];
            saySMS['_'].should.equal(message.message);
            saySMS['$']['to'].should.equal(users.inviter.number);
          }
        );
      });
    });

    it('should move to the second round on successful answer', function() {
      var users = getUsers();
      var msg = 'Jurassic Park';
      var msg2 = 'SILENCE OF THE LAMBS';

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
          Message.get('game-next-round', [users.invited.username]),
          Message.get('game-next-round-suggestion', [users.invited.username, msg2]),
          function(output, inviterMessage, invitedMessage) {
            //console.log('output', output.Response.Sms);
            var inviterSms = output.Response.Sms[1];
            inviterSms['_'].should.equal(inviterMessage.message);
            inviterSms['$']['to'].should.equal(users.inviter.number);
            var invitedSms = output.Response.Sms[2];
            invitedSms['_'].should.equal(invitedMessage.message);
            invitedSms['$']['to'].should.equal(users.invited.number);
          }
        );
      });
    });

    it('should allow the second round to take a guess and move to the third round', function() {
      var users = getUsers();
      var msg = 'Jurassic Park';
      var msg2 = 'SILENCE OF THE LAMBS';
      var msg3 = 'TIME AFTER TIME';

      return startGame(users).then(function() {
        return Promise.join(
          req.p({
            username: users.inviter.number,
            message: JURASSIC_PARK 
          }, params, true),
          Message.get('game-submission-sent'),
          function(response, gameSubmissionSent) {
            response.Response.Message[0].should.equal(gameSubmissionSent.message);
          }
        );
      }).then(function() {
        // the invited user guesses the correct answer
        return req.p({
          username: users.invited.number,
          message: msg
        }, params, true);
      }).then(function(response) {
        // now its time for the invited user to send emojis
        return Promise.join(
          req.p({
            username: users.invited.number,
            message: SILENCE_OF_THE_LAMBS 
          }, params, true),
          Message.get('game-submission-sent'),
          function(response, gameSubmissionSent) {
            //console.log('\n\n\n\n\n\n4\n\n\n\n\n\n\n');
            //console.log('silence of lambs submission', JSON.stringify(response));
            response.Response.Message[0].should.equal(gameSubmissionSent.message);
          }
        );
      }).then(function() {
        console.log('silence of the lambs prepare to guess');
        return Promise.join(
          req.p({
            username: users.inviter.number,
            message: msg2
          }, params, true),
          Message.get('correct-guess', [users.inviter.username]),
          Message.get('game-next-round', [users.invited.username]),
          Message.get('game-next-round-suggestion', [users.inviter.username, msg3]),
          function(output, correctGuess, invitedMessage, inviterMessage) {
            console.log('output', output.Response);
            //output.Response.Message[0].should.equal(correctGuess.message);
            console.log('1');
            var correct = output.Response.Sms[0];
            correct['_'].should.equal(correctGuess.message);
            console.log('3');
            correct['$']['to'].should.equal(users.invited.number);
            console.log('4');
            var invitedSms = output.Response.Sms[1];
            console.log('5');
            invitedSms['_'].should.equal(invitedMessage.message);
            console.log('6');
            invitedSms['$']['to'].should.equal(users.invited.number);
            console.log('7');
            var inviterSms = output.Response.Sms[2];
            console.log('8');
            inviterSms['_'].should.equal(inviterMessage.message);
            console.log('9');
            inviterSms['$']['to'].should.equal(users.inviter.number);
            console.log('10');
          }
        );
      });
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

  function getUsers(numbers) {

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
