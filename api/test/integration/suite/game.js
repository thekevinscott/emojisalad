/*
 * Tests that games work with two players
 *
 */

var req = require('./lib/req');
var Message = require('../../../models/Message');
var Game = require('../../../models/Game');
var User = require('../../../models/User');
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

    it('should initiate the game with the person who started it', function() {
      var users = getUsers();
      var phrase = 'JURASSIC PARK';

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
      }).then(function(output) {
        return Game.get(users).then(function(game) {
          return Message.get('game-start', [game.round.submitter.nickname, phrase]).then(function(gameStartMessage) {
            var Sms = output.Response.Sms[1];
            Sms['_'].should.equal(gameStartMessage.message);
            Sms['$']['to'].should.equal(game.round.submitter.number);
            return output;
          });
        });
      });
    });

    describe('Submissions', function() {

      it('should get pissy if you try and send nothing as a submission', function() {
        var users = getUsers();

        return startGame(users).then(function(game) {
          return Promise.join(
            req.p({
              username: game.round.submitter.number,
              message: '' 
            }, params),
            function(response) {
              response[0].should.equal('You must provide a message');
            }
          );
        });
      });

      it('should get pissy if you try and send a non-emoji submission', function() {
        var users = getUsers();

        return startGame(users).then(function(game) {
          return Promise.join(
            req.p({
              username: game.round.submitter.number,
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

        return startGame(users).then(function(game) {
          var msg = JURASSIC_PARK;
          return Promise.join(
            req.p({
              username: game.round.submitter.number,
              message: msg
            }, params, true),
            Message.get('game-submission-sent'),
            Message.get('says', [game.round.submitter.nickname, msg]),
            Message.get('guessing-instructions'),
            function(output, message, forwardedMessage, guessingInstructions) {
              output.Response.Message[0].should.equal(message.message);
              game.round.players.map(function(player, i) {
                var saySMS = output.Response.Sms[i+0];
                var instructionsSMS = output.Response.Sms[i+1];
                saySMS['_'].should.equal(forwardedMessage.message);
                saySMS['$']['to'].should.equal(player.number);
                instructionsSMS['_'].should.equal(guessingInstructions.message);
                instructionsSMS['$']['to'].should.equal(player.number);
              });
            }
          );
        });
      });

      describe('Valid Emoji', function() {
        function checkValidEmoji(emoji) {
          var users = getUsers();
          return startGame(users).then(function(game) {
            return Promise.join(
              req.p({
              username: game.round.submitter.number,
              message: emoji
            }, params, true),
            Message.get('game-submission-sent'),
            Message.get('says', [game.round.submitter.nickname, emoji]),
            Message.get('guessing-instructions'),
            function(output, message, forwardedMessage, guessingInstructions) {
              output.Response.Message[0].should.equal(message.message);
              game.round.players.map(function(player, i) {
                var saySMS = output.Response.Sms[i+0];
                var instructionsSMS = output.Response.Sms[i+1];
                saySMS['_'].should.equal(forwardedMessage.message);
                saySMS['$']['to'].should.equal(player.number);
                instructionsSMS['_'].should.equal(guessingInstructions.message);
                instructionsSMS['$']['to'].should.equal(player.number);
              });
            }
            );
          });
        }

        it('should check a smiley', function() {
          return checkValidEmoji('😀');
        });

        it('should check a rocket', function() {
          return checkValidEmoji('🚀');
        });

        it('should check a filling hourglass', function() {
          return checkValidEmoji('⏳');
        });

        //it('should check a hourglass', function() {
          //return checkValidEmoji('⌛️');
        //});

        it('should check a back', function() {
          return checkValidEmoji('🔙');
        });

      });

    });

    it('should allow other players to cross talk', function() {
      var users = getUsers();
      var preMsg = 'FUCK';
      var msg = 'The fuck is that?';
      var msg2 = 'Shut up and guess';

      return startGame(users).then(function(game) {
        // try cross talking before the submission is back
        return Promise.join(
          req.p({
            username: game.round.players[0].number,
            message: preMsg 
          }, params, true),
          Message.get('says', [game.round.players[0].nickname, preMsg]),
          function(output, says) {
            var i = 0;
            game.players.map(function(player) {
              if ( player.id === game.round.players[0].id ) {
                // msg should not exist
              } else {
                var saySMS = output.Response.Sms[i];
                saySMS['_'].should.equal(says.message);
                saySMS['$']['to'].should.equal(player.number);
                i++;
              }
            });
            return game;
          }
        );
      }).then(function(game) {
        return req.p({
          username: game.round.submitter.number,
          message: JURASSIC_PARK 
        }, params, true).then(function() {
          return game;
        });
      }).then(function(game) {
        return Promise.join(
          req.p({
            username: game.round.players[0].number,
            message: msg
          }, params, true),
          Message.get('says', [game.round.players[0].nickname, msg]),
          function(output, message) {
            var i = 0;
            game.players.map(function(player) {
              if ( player.id !== game.round.players[0].id ) {
                var saySMS = output.Response.Sms[i];
                saySMS['_'].should.equal(message.message);
                saySMS['$']['to'].should.equal(player.number);
                i++;
              }
            });
            return game;
          }
        );
      }).then(function(game) {
        return Promise.join(
          req.p({
            username: game.round.submitter.number,
            message: msg2
          }, params, true),
          Message.get('says', [game.round.submitter.nickname, msg2]),
          function(output, message) {
            game.round.players.map(function(player, i) {
              if ( player.id !== game.round.submitter.id ) {
                var saySMS = output.Response.Sms[i];
                saySMS['_'].should.equal(message.message);
                saySMS['$']['to'].should.equal(player.number);
              }
            });
          }
        );
      });
    });

    it('should allow other players to guess', function() {
      var users = getUsers();
      var msg = 'guess foo';

      return startGame(users).then(function(game) {
        return req.p({
          username: game.round.submitter.number,
          message: JURASSIC_PARK 
        }, params, true).then(function() {
          return game;
        });
      }).then(function(game) {
        return Promise.join(
          req.p({
            username: game.round.players[0].number,
            message: msg
          }, params, true),
          Message.get('says', [game.round.players[0].nickname, msg]),
          Message.get('incorrect-guess', []),
          function(output, says, message) {
            // every player in the game should receive this message

            var i = 0;
            game.players.map(function(player) {
              if ( player.id !== game.round.players[0].id ) {
                var saySMS = output.Response.Sms[i];
                saySMS['_'].should.equal(says.message);
                saySMS['$']['to'].should.equal(player.number);
                i++;
              }
            });

            var count = i;

            game.players.map(function(player, i) {
              var resultSMS = output.Response.Sms[count+i];
              resultSMS['_'].should.equal(message.message);
              resultSMS['$']['to'].should.equal(player.number);
            });
          }
        );
      });
    });

    it('should move to the second round on successful answer', function() {
      var users = getUsers();
      var msg = 'Jurassic Park';
      var msg2 = 'SILENCE OF THE LAMBS';

      return startGame(users).then(function(game) {
        return req.p({
          username: game.round.submitter.number,
          message: JURASSIC_PARK 
        }, params, true).then(function() {
          return game;
        });
      }).then(function(game) {
        return Promise.join(
          req.p({
            username: game.round.players[0].number,
            message: 'guess '+msg
          }, params, true),
          Message.get('says', [game.round.players[0].nickname, 'guess '+msg]),
          Message.get('correct-guess', [game.round.players[0].nickname]),
          Message.get('game-next-round', [users.invited.username]),
          Message.get('game-next-round-suggestion', [users.invited.username, msg2]),
          function(output, says, correct, nextRound, suggestion) {
            // every player in the game should receive this message
            var count = 0;
            var count2 = 0;
            var i = 0;
            game.players.map(function(player) {
              if ( player.id !== game.round.players[0].id ) {
                count++;
                var saySMS = output.Response.Sms[i];
                saySMS['_'].should.equal(says.message);
                saySMS['$']['to'].should.equal(player.number);
                i++;
              }
            });

            game.players.map(function(player, i) {
              count2++;
              var resultSMS = output.Response.Sms[count+i];
              resultSMS['_'].should.equal(correct.message);
              resultSMS['$']['to'].should.equal(player.number);
            });

            output.Response.Sms.slice(count+count2).map(function(message) {
              game.players.map(function(player) {
                if ( player.number === message['$']['to'] ) {
                  if ( player.id === game.round.players[0].id ) {
                    message['_'].should.equal(suggestion.message);
                  } else {
                    message['_'].should.equal(nextRound.message);
                  }
                }
              });
            });
          }
        );
      });
    });

    it('should allow the second round to take a guess and move to the third round with the first submitter guessing in a two person game', function() {
      var users = getUsers();
      var msg = 'Jurassic Park';
      var msg2 = 'SILENCE OF THE LAMBS';
      var msg3 = 'TIME AFTER TIME';

      var firstSubmitter;
      var secondSubmitter;

      return startGame(users).then(function(game) {
        firstSubmitter = game.round.submitter;
        secondSubmitter = game.round.players[0];
        //console.log('first', firstSubmitter.id);
        //console.log('second', secondSubmitter.id);
        return req.p({
          username: firstSubmitter.number,
          message: JURASSIC_PARK 
        }, params, true).then(function() {
          return game;
        });
      }).then(function(game) {
        //console.log('395 should have guessed jurassic park');
        return req.p({
          username: secondSubmitter.number,
          message: 'guess '+msg 
        }, params, true).then(function() {
          return game;
        });
      }).then(function(game) {
        //console.log('395 is now to send emoji for silence of lambs');
        return req.p({
          username: secondSubmitter.number,
          message: SILENCE_OF_THE_LAMBS
        }, params, true).then(function() {
          return game;
        });
      }).then(function(game) {
        //console.log('394 must now guess silence of the lambs');
        return Promise.join(
          req.p({
            username: firstSubmitter.number,
            message: 'guess ' + msg2
          }, params, true),
          Message.get('says', [firstSubmitter.nickname, 'guess ' +msg2]),
          Message.get('correct-guess', [firstSubmitter.nickname]),
          Message.get('game-next-round', [firstSubmitter.nickname]),
          Message.get('game-next-round-suggestion', [firstSubmitter.nickname, msg3]),
          function(output, says, correct, nextRound, suggestion) {
            //console.log('394 should now be the submitter');
            // every player in the game should receive this message
            var saySMS = output.Response.Sms[0];
            saySMS['_'].should.equal(says.message);
            saySMS['$']['to'].should.equal(secondSubmitter.number);

            var count = 1;
            game.players.map(function(player, i) {
              count++;
              var resultSMS = output.Response.Sms[i+1];
              resultSMS['_'].should.equal(correct.message);
              resultSMS['$']['to'].should.equal(player.number);
            });

            //console.log('output', output.Response.Sms.slice(count));
            //console.log('\n\n\n');
            output.Response.Sms.slice(count).map(function(message) {
              game.players.map(function(player) {
                if ( player.number === message['$']['to'] ) {
                  if ( player.id === firstSubmitter.id ) {
                    //console.log('incoming Message', suggestion);
                    //console.log('expected message', message);
                    //console.log('player', player);
                    message['_'].should.equal(suggestion.message);
                  } else {
                    //console.log('incoming message', nextRound);
                    //console.log('expected message', message);
                    //console.log('player', player);
                    message['_'].should.equal(nextRound.message);
                  }
                }
              });
            });
          }
        );
      });
    });

    it('should be able to invite at each step of the process', function() {
      var users = getUsers();

      var randos = [
        '+1'+params.getUser(),
        '+1'+params.getUser(),
        '+1'+params.getUser(),
        '+1'+params.getUser(),
        '+1'+params.getUser(),
        '+1'+params.getUser(),
      ];

      return startGame(users).then(function(game) {
        // clue is out for submission
        return Promise.join(
          req.p({
            username: users.inviter.number,
            message: 'Invite '+randos[0]
          }, params, true),
          Message.get('intro_4', [randos[0]]),
          Message.get('invite', [users.inviter.username]),
          function(output, invited, invite) {
            output.Response.Message[0].should.equal(invited.message);
            output.Response.Sms[0]['_'].should.equal(invite.message);
            output.Response.Sms[0]['$']['to'].should.equal(randos[0]);
          }
        );
      }).then(function() {
        // clue is out for submission
        return Promise.join(
          req.p({
            username: users.invited.number,
            message: 'Invite '+randos[1]
          }, params, true),
          Message.get('intro_4', [randos[1]]),
          Message.get('invite', [users.invited.username]),
          function(output, invited, invite) {
            output.Response.Message[0].should.equal(invited.message);
            output.Response.Sms[0]['_'].should.equal(invite.message);
            output.Response.Sms[0]['$']['to'].should.equal(randos[1]);
          }
        );
      }).then(function() {
        // submit clue
        return req.p({
          username: users.inviter.number,
          message: JURASSIC_PARK
        }, params);
      }).then(function() {
        // round is live
        return Promise.join(
          req.p({
            username: users.inviter.number,
            message: 'Invite '+randos[2]
          }, params, true),
          Message.get('intro_4', [randos[2]]),
          Message.get('invite', [users.inviter.username]),
          function(output, invited, invite) {
            output.Response.Message[0].should.equal(invited.message);
            output.Response.Sms[0]['_'].should.equal(invite.message);
            output.Response.Sms[0]['$']['to'].should.equal(randos[2]);
          }
        );
      }).then(function() {
        // round is live
        return Promise.join(
          req.p({
            username: users.invited.number,
            message: 'Invite '+randos[3]
          }, params, true),
          Message.get('intro_4', [randos[3]]),
          Message.get('invite', [users.invited.username]),
          function(output, invited, invite) {
            output.Response.Message[0].should.equal(invited.message);
            output.Response.Sms[0]['_'].should.equal(invite.message);
            output.Response.Sms[0]['$']['to'].should.equal(randos[3]);
          }
        );
      }).then(function() {
        // answer the round
        return req.p({
          username: users.invited.number,
          message: 'guess jurassic park'
        }, params);
      }).then(function() {
        // correct, next clue
        return Promise.join(
          req.p({
            username: users.inviter.number,
            message: 'Invite '+randos[4]
          }, params, true),
          Message.get('intro_4', [randos[4]]),
          Message.get('invite', [users.inviter.username]),
          function(output, invited, invite) {
            output.Response.Message[0].should.equal(invited.message);
            output.Response.Sms[0]['_'].should.equal(invite.message);
            output.Response.Sms[0]['$']['to'].should.equal(randos[4]);
          }
        );
      }).then(function() {
        return Promise.join(
          req.p({
            username: users.invited.number,
            message: 'Invite '+randos[5]
          }, params, true),
          Message.get('intro_4', [randos[5]]),
          Message.get('invite', [users.invited.username]),
          function(output, invited, invite) {
            output.Response.Message[0].should.equal(invited.message);
            output.Response.Sms[0]['_'].should.equal(invite.message);
            output.Response.Sms[0]['$']['to'].should.equal(randos[5]);
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
    }).then(function() {
      return User.get( users.inviter );
    }).then(function(user) {
      return Game.get({ user: user });
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
