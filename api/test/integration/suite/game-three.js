/*
 * Tests that games work with three players
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

  describe('Game with three players', function() {
    var JURASSIC_PARK = '⏰🐲🐊🐉   🌳🌳🌳';
    var MIXED_EMOJI = '😀😀😀😀foo🚀🚀🚀🚀' ;
    var SILENCE_OF_THE_LAMBS = '🙊  🐑       🔪🔫';
    var numbers = [];
    this.timeout(60000);

    it('should be able to invite a third player before a round', function() {
      var users = getUsers();
      var inviteMichelle = 'Hey, do you think we should invite Michelle?';
      var sendInvite = 'invite '+users.secondInvited.number;
      var yesIDid = 'Ok I invited her, she has to accept';

      return startGame(users).then(function(game) {
        return Promise.join(
          req.p({
            username: game.round.submitter.number,
            message: sendInvite 
          }, params, true),
          Message.get('intro_4', [users.secondInvited.number]),
          Message.get('invite', [users.inviter.nickname]),
          function(output, message, invitedMessage) {
            output.Response.Message[0].should.equal(message.message);

            output.Response.Sms[0]['_'].should.equal(invitedMessage.message);
            output.Response.Sms[0]['$']['to'].should.equal(users.secondInvited.number);
          }
        );
      });
    });

    it('should be able to invite a third player in the middle of a round', function() {
      var users = getUsers();
      var inviteMichelle = 'Hey, do you think we should invite Michelle?';
      var sendInvite = 'invite '+users.secondInvited.number;
      var yesIDid = 'Ok I invited her, she has to accept';

      return startGame(users).then(function(game) {
        var msg = JURASSIC_PARK;
        return req.p({
          username: game.round.submitter.number,
          message: msg
        }, params, true).then(function() {
          console.log('ok round is live thanks to', game.round.submitter);
          // Submitter (Inviter) has started off the round, it is live.
          return Promise.join(
            req.p({
              username: users.invited.number,
              message: inviteMichelle
            }, params, true),
            Message.get('says', [users.invited.nickname, inviteMichelle]),
            function(output, message) {
              output.Response.Sms[0]['_'].should.equal(message.message);
              output.Response.Sms[0]['$']['to'].should.equal(users.inviter.number);
            }
          );
        }).then(function() {
          return Promise.join(
            req.p({
              username: users.inviter.number,
              message: sendInvite 
            }, params, true),
            Message.get('intro_4', [users.secondInvited.number]),
            Message.get('invite', [users.inviter.nickname]),
            function(output, message, invitedMessage) {
              console.log('output', output.Response);
              output.Response.Message[0].should.equal(message.message);

              output.Response.Sms[0]['_'].should.equal(invitedMessage.message);
              output.Response.Sms[0]['$']['to'].should.equal(users.secondInvited.number);
            }
          );
        });
      });
    });

    it('should be able successfully to invite a third player to the game', function() {
      var users = getUsers();
      var inviteMichelle = 'Hey, do you think we should invite Michelle?';
      var sendInvite = 'invite '+users.secondInvited.number;
      var yesIDid = 'Ok I invited her, she has to accept';

      return startGame(users).then(function(game) {
        var msg = JURASSIC_PARK;
        return req.p({
          username: game.round.submitter.number,
          message: msg
        }, params, true).then(function() {
          // Submitter (Inviter) has started off the round, it is live.
          return Promise.join(
            req.p({
              username: users.invited.number,
              message: inviteMichelle
            }, params, true),
            Message.get('says', [users.invited.nickname, inviteMichelle]),
            function(output, message) {
              output.Response.Sms[0]['_'].should.equal(message.message);
              output.Response.Sms[0]['$']['to'].should.equal(users.inviter.number);
            }
          );
        }).then(function() {
          return Promise.join(
            req.p({
              username: users.inviter.number,
              message: sendInvite 
            }, params, true),
            Message.get('intro_4', [users.secondInvited.number]),
            Message.get('invite', [users.inviter.nickname]),
            function(output, message, invite) {
              output.Response.Message[0].should.equal(message.message);
              output.Response.Sms[0]['_'].should.equal(invite.message);
              output.Response.Sms[0]['$']['to'].should.equal(users.secondInvited.number);
            }
          );
        }).then(function() {
          return Promise.join(
            req.p({
              username: users.inviter.number,
              message: yesIDid 
            }, params, true),
            Message.get('says', [users.inviter.nickname, yesIDid]),
            function(output, message) {
              output.Response.Sms[0]['_'].should.equal(message.message);
              output.Response.Sms[0]['$']['to'].should.equal(users.invited.number);
            }
          );
        });
      });
    });

    it('should allow a third player to join in between rounds', function() {
      var users = getUsers();
      console.log('users', users);
      var sendInvite = 'invite '+users.secondInvited.number;

      return startGame(users).then(function(game) {
        console.log('\n\n\n\n');
        console.log(game.players);
        return req.p({
          username: users.inviter.number,
          message: sendInvite 
        }, params, true).then(function() {
          return req.p({
            username: users.secondInvited.number,
            message: 'yes' 
          }, params);
        }).then(function() {
          return Promise.join(
            req.p({
              username: users.secondInvited.number,
              message: users.secondInvited.nickname
            }, params, true),
            Message.get('accepted-inviter', [users.secondInvited.nickname, users.inviter.nickname]),
            Message.get('accepted-invited', [users.secondInvited.nickname]),
            Message.get('join-game', [users.secondInvited.nickname]),
            function(output, message, accepted, join) {
              output.Response.Message[0].should.equal(message.message);
              output.Response.Sms.splice(0,2).map(function(sms) {
                if ( sms['$']['to'] === users.inviter.number ) {
                  sms['_'].should.equal(accepted.message);
                } else if ( sms['$']['to'] === users.invited.number ) {
                  sms['_'].should.equal(join.message);
                }
              });
              output.Response.Sms.length.should.equal(0);
            }
          );
        }).then(function() {
          // then play the game
          return Promise.join(
            req.p({
              username: users.inviter.number,
              message: JURASSIC_PARK 
            }, params, true),
            Message.get('game-submission-sent'),
            Message.get('says', [users.inviter.nickname, JURASSIC_PARK]),
            Message.get('guessing-instructions'),
            function(output, message, says, instructions) {
              console.log('response', output.Response);
              output.Response.Message[0].should.equal(message.message);

              output.Response.Sms.splice(0,2).map(function(sms) {
                if ( sms['$']['to'] === users.invited.number ) {
                  sms['_'].should.equal(says.message);
                } else if ( sms['$']['to'] === users.secondInvited.number ) {
                  sms['_'].should.equal(says.message);
                } else {
                  throw "Message addressed incorrectly";
                }
              });

              output.Response.Sms.splice(0,2).map(function(sms) {
                if ( sms['$']['to'] === users.invited.number ) {
                  console.log(sms);
                  //sms['_'].should.equal(accepted.message);
                } else if ( sms['$']['to'] === users.secondInvited.number ) {
                  console.log(sms);
                  //sms['_'].should.equal(join.message);
                } else {
                  throw "Message addressed incorrectly";
                }
              });

              console.log('remaining output', output.Response.Sms);

              output.Response.Sms.length.should.equal(0);
            }
          );
        });
      });
    });

    return;

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
        console.log('first', firstSubmitter.id);
        console.log('second', secondSubmitter.id);
        return req.p({
          username: firstSubmitter.number,
          message: JURASSIC_PARK 
        }, params, true).then(function() {
          return game;
        });
      }).then(function(game) {
        console.log('395 should have guessed jurassic park');
        return req.p({
          username: secondSubmitter.number,
          message: 'guess '+msg 
        }, params, true).then(function() {
          return game;
        });
      }).then(function(game) {
        console.log('395 is now to send emoji for silence of lambs');
        return req.p({
          username: secondSubmitter.number,
          message: SILENCE_OF_THE_LAMBS
        }, params, true).then(function() {
          return game;
        });
      }).then(function(game) {
        console.log('394 must now guess silence of the lambs');
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
            console.log('394 should now be the submitter');
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

            console.log('output', output.Response.Sms.slice(count));
            console.log('\n\n\n');
            output.Response.Sms.slice(count).map(function(message) {
              game.players.map(function(player) {
                if ( player.number === message['$']['to'] ) {
                  if ( player.id === firstSubmitter.id ) {
                    console.log('incoming Message', suggestion);
                    console.log('expected message', message);
                    console.log('player', player);
                    message['_'].should.equal(suggestion.message);
                  } else {
                    console.log('incoming message', nextRound);
                    console.log('expected message', message);
                    console.log('player', player);
                    message['_'].should.equal(nextRound.message);
                  }
                }
              });
            });
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
        message: user.nickname // the nickname
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
        message: users.invited.nickname 
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
      nickname: 'Ari'
    };
    var invited = {
      number: '+1'+params.getUser(), // add a +1 to simulate twilio
      nickname: 'Kevin'
    }
    var secondInvited = {
      number: '+1'+params.getUser(), // add a +1 to simulate twilio
      nickname: 'SCHLOOOOO'
    }

    var users = {
      inviter: inviter,
      invited: invited,
      secondInvited: secondInvited
    };

    return users;
  }
}

