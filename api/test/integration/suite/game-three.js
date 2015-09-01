/*
 * Tests that games work with three players
 *
 */

var expect = require('chai').expect;
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
  var JURASSIC_PARK = '⏰🐲🐊🐉   🌳🌳🌳';
  var MIXED_EMOJI = '😀😀😀😀foo🚀🚀🚀🚀' ;
  var SILENCE_OF_THE_LAMBS = '🙊  🐑       🔪🔫';
  var TIME_AFTER_TIME = '🚀🚀';
  var numbers = [];

  describe('Game with three players', function() {
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
      var sendInvite = 'invite '+users.secondInvited.number;

      return startGame(users).then(function(game) {
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
              output.Response.Message[0].should.equal(message.message);

              var smses = output.Response.Sms.splice(0, 4);
              smses.length.should.equal(4);
              smses.map(function(sms) {
                console.log('sms', sms);
                if ( sms['$']['to'] === users.invited.number ) {
                  expect([says.message, instructions.message]).to.contain(sms['_']);
                } else if ( sms['$']['to'] === users.secondInvited.number ) {
                  expect([says.message, instructions.message]).to.contain(sms['_']);
                } else {
                  throw "Message addressed incorrectly";
                }
              });

              //output.Response.Sms.splice(0,2).map(function(sms) {
                //if ( sms['$']['to'] === users.invited.number ) {
                  //console.log(sms);
                //} else if ( sms['$']['to'] === users.secondInvited.number ) {
                  //console.log(sms);
                //} else {
                  //throw "Message addressed incorrectly";
                //}
              //});

              console.log('remaining output', output.Response.Sms);

              output.Response.Sms.length.should.equal(0);
            }
          );
        });
      });
    });

    it('should make a third player who joins in the middle of a round wait until the next round', function() {
      var users = getUsers();
      var sendInvite = 'invite '+users.secondInvited.number;

      return startGame(users).then(function(game) {
        return req.p({
          username: users.inviter.number,
          message: JURASSIC_PARK 
        }, params, true).then(function() {
          return req.p({
            username: users.inviter.number,
            message: sendInvite 
          }, params, true);
        }).then(function() {
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
            Message.get('accepted-inviter-next-round', [users.secondInvited.nickname, users.inviter.nickname]),
            Message.get('accepted-invited-next-round', [users.secondInvited.nickname]),
            Message.get('join-game-next-round', [users.secondInvited.nickname]),
            function(output, message, accepted, join) {
              output.Response.Message[0].should.equal(message.message);
              output.Response.Sms.length.should.equal(3);
              output.Response.Sms.map(function(sms) {
                if ( sms['$']['to'] === users.inviter.number ) {
                  expect([
                    accepted.message,
                    join.message
                  ]).to.contain(sms['_']);
                } else {
                  sms['_'].should.equal(join.message);
                }
              });
            }
          );
        }).then(function() {
          var schlooSays = 'o hai guys';
          return Promise.join(
            req.p({
              username: users.secondInvited.number,
              message: schlooSays
            }, params, true),
            Message.get('says', [users.secondInvited.nickname, schlooSays]),
            function(output, message) {
              output.Response.Sms.length.should.equal(2);
              output.Response.Sms.map(function(sms) {
                sms['_'].should.equal(message.message);
                expect([
                  users.inviter.number,
                  users.invited.number
                ]).to.contain(sms['$']['to']);
              });
            }
          );
        }).then(function() {
          var schlooSays = 'guess Jurassic Park';
          return Promise.join(
            req.p({
              username: users.secondInvited.number,
              message: schlooSays
            }, params, true),
            Message.get('says', [users.secondInvited.nickname, schlooSays]),
            function(output, message) {
              // This should not allow Schloo to guess
              output.Response.Sms.length.should.equal(2);
              output.Response.Sms.map(function(sms) {
                sms['_'].should.equal(message.message);
                expect([
                  users.inviter.number,
                  users.invited.number
                ]).to.contain(sms['$']['to']);
              });
            }
          );
        //}).then(function() {
          //var correct = 'guess Jurassic Park';
          //return Promise.join(
            //req.p({
              //username: users.invited.number,
              //message: correct 
            //}, params, true),
            //Message.get('says', [users.invited.nickname, correct]),
            //function(output, message) {
              //output.Response.Sms.length.should.equal(2);
              //output.Response.Sms.map(function(sms) {
                //sms['_'].should.equal(message.message);
                //expect([
                  //users.inviter.number,
                  //users.invited.number
                //]).to.contain(sms['$']['to']);
              //});
            //}
          //);
        });
      });
    });

    it('should let a third player join in at the next round and proceed to second user', function() {
      var users = getUsers();
      var sendInvite = 'invite '+users.secondInvited.number;
      var msg2 = 'SILENCE OF THE LAMBS';

      return startGame(users).then(function(game) {
        return req.p({
          username: users.inviter.number,
          message: JURASSIC_PARK 
        }, params, true).then(function() {
          return req.p({
            username: users.inviter.number,
            message: sendInvite 
          }, params, true);
        }).then(function() {
          return req.p({
            username: users.secondInvited.number,
            message: 'yes' 
          }, params);
        }).then(function() {
          return req.p({
            username: users.secondInvited.number,
            message: users.secondInvited.nickname
          }, params, true);
        }).then(function() {
          var correct = 'guess Jurassic Park';
          return Promise.join(
            req.p({
              username: users.invited.number,
              message: correct 
            }, params, true),
            Message.get('says', [users.invited.nickname, correct]),
            Message.get('correct-guess', [users.invited.nickname]),
            Message.get('game-next-round', [users.invited.nickname]),
            Message.get('game-next-round-suggestion', [users.invited.nickname, msg2]),
            function(output, says, correct, nextRound, suggestion) {
              // every player in the game should receive this message
              output.Response.Sms.length.should.equal(8);

              output.Response.Sms.map(function(sms) {
                console.log('sms', sms);
                if ( sms['$']['to'] === users.invited.number ) {
                  console.log('user who guessed');
                  // this is the user who guessed
                  expect([
                    correct.message,
                    suggestion.message
                  ]).to.contain(sms['_']);
                } else if ( sms['$']['to'] === users.inviter.number ) {
                  console.log('inviter');
                  expect([
                    says.message,
                    correct.message,
                    nextRound.message
                  ]).to.contain(sms['_']);
                } else if ( sms['$']['to'] === users.secondInvited.number ) {
                  console.log('second invited', says.message);
                  expect([
                    says.message,
                    correct.message,
                    nextRound.message
                  ]).to.contain(sms['_']);
                }
              });
            }
          );
        });
      });
    });

    it('should let a third player join in at the second round and proceed to third user', function() {
      var users = getUsers();
      var sendInvite = 'invite '+users.secondInvited.number;
      var msg2 = 'SILENCE OF THE LAMBS';
      var msg3 = 'TIME AFTER TIME';

      return startGame(users).then(function(game) {
        return req.p({
          username: users.inviter.number,
          message: JURASSIC_PARK 
        }, params, true).then(function() {
          return req.p({
            username: users.inviter.number,
            message: sendInvite 
          }, params, true);
        }).then(function() {
          return req.p({
            username: users.secondInvited.number,
            message: 'yes' 
          }, params);
        }).then(function() {
          return req.p({
            username: users.invited.number,
            message: 'guess Jurassic Park'
          }, params, true);
        }).then(function() {
          return req.p({
            username: users.invited.number,
            message: SILENCE_OF_THE_LAMBS
          }, params, true);
        }).then(function() {
          return req.p({
            username: users.secondInvited.number,
            message: users.secondInvited.nickname
          }, params, true);
        }).then(function() {
          var correct = 'guess Silence of the lambs';
          return Promise.join(
            req.p({
              username: users.inviter.number,
              message: correct 
            }, params, true),
            Message.get('says', [users.inviter.nickname, correct]),
            Message.get('correct-guess', [users.inviter.nickname]),
            Message.get('game-next-round', [users.secondInvited.nickname]),
            Message.get('game-next-round-suggestion', [users.secondInvited.nickname, msg3]),
            function(output, says, correct, nextRound, suggestion) {
              // we expect these to be in order, too
              output.Response.Sms.length.should.equal(8);

              console.log('response', output.Response.Sms);
              output.Response.Sms.splice(0, 2).map(function(sms) {
                says.message.should.equal(sms['_']);
                expect([
                  users.invited.number,
                  users.secondInvited.number,
                ]).to.contain(sms['$']['to']);
              });

              output.Response.Sms.splice(0, 3).map(function(sms) {
                correct.message.should.equal(sms['_']);
                expect([
                  users.inviter.number,
                  users.invited.number,
                  users.secondInvited.number,
                ]).to.contain(sms['$']['to']);
              });

              output.Response.Sms.splice(0, 3).map(function(sms) {
                expect([
                  suggestion.message,
                  nextRound.message
                ]).to.contain(sms['_']);

                expect([
                  users.inviter.number,
                  users.invited.number,
                  users.secondInvited.number,
                ]).to.contain(sms['$']['to']);
              });
            }
          );
        });
      });
    });

    it('should loop back to first user after a full round', function() {
      var users = getUsers();
      var sendInvite = 'invite '+users.secondInvited.number;
      var msg2 = 'SILENCE OF THE LAMBS';
      var msg3 = 'TIME AFTER TIME';
      var msg4 = 'BUFFALO WILD WINGS';

      return jumpIntoThirdRound(users).then(function(game) {
        var correct = 'guess Time after time';
        return Promise.join(
          req.p({
          username: users.invited.number,
          message: correct 
        }, params, true),
        Message.get('says', [users.invited.nickname, correct]),
        Message.get('correct-guess', [users.invited.nickname]),
        Message.get('game-next-round', [users.inviter.nickname]),
        Message.get('game-next-round-suggestion', [users.inviter.nickname, msg4]),
        function(output, says, correct, nextRound, suggestion) {
          console.log('response back', output.Response);
          // we expect these to be in order, too
          output.Response.Sms.length.should.equal(8);

          output.Response.Sms.splice(0, 2).map(function(sms) {
            says.message.should.equal(sms['_']);
            expect([
              users.inviter.number,
              users.secondInvited.number,
            ]).to.contain(sms['$']['to']);
          });

          output.Response.Sms.splice(0, 3).map(function(sms) {
            correct.message.should.equal(sms['_']);
            expect([
              users.inviter.number,
              users.invited.number,
              users.secondInvited.number,
            ]).to.contain(sms['$']['to']);
          });

          output.Response.Sms.splice(0, 3).map(function(sms) {
            expect([
              suggestion.message,
              nextRound.message
            ]).to.contain(sms['_']);

            expect([
              users.inviter.number,
              users.invited.number,
              users.secondInvited.number,
            ]).to.contain(sms['$']['to']);
          });
        }
        );
      });
    });

    it('should alert everyone when a wrong guess has been made', function() {
      var users = getUsers();
      var sendInvite = 'invite '+users.secondInvited.number;
      var msg2 = 'SILENCE OF THE LAMBS';
      var msg3 = 'TIME AFTER TIME';

      return jumpIntoThirdRound(users).then(function(game) {
        var correct = 'guess TIME AFTER TIME';
        return Promise.join(
          req.p({
          username: users.invited.number,
          message: correct 
        }, params, true),
        Message.get('says', [users.invited.nickname, correct]),
        Message.get('correct-guess', [users.invited.nickname]),
        Message.get('game-next-round', [users.inviter.nickname]),
        Message.get('game-next-round-suggestion', [users.inviter.nickname, msg3]),
        function(output, says, correct, nextRound, suggestion) {
          console.log('response back', output.Response);
          // we expect these to be in order, too
          output.Response.Sms.length.should.equal(8);

          output.Response.Sms.splice(0, 2).map(function(sms) {
            says.message.should.equal(sms['_']);
            expect([
              users.inviter.number,
              users.secondInvited.number,
            ]).to.contain(sms['$']['to']);
          });

          output.Response.Sms.splice(0, 3).map(function(sms) {
            correct.message.should.equal(sms['_']);
            expect([
              users.inviter.number,
              users.invited.number,
              users.secondInvited.number,
            ]).to.contain(sms['$']['to']);
          });

          output.Response.Sms.splice(0, 3).map(function(sms) {
            expect([
              suggestion.message,
              nextRound.message
            ]).to.contain(sms['_']);

            expect([
              users.inviter.number,
              users.invited.number,
              users.secondInvited.number,
            ]).to.contain(sms['$']['to']);
          });
        }
        );
      });
    });

    it('should allow cross talk between rounds', function() {
      var users = getUsers();
      var sendInvite = 'invite '+users.secondInvited.number;
      var msg2 = 'SILENCE OF THE LAMBS';
      var msg3 = 'TIME AFTER TIME';

      return jumpIntoThirdRound(users).then(function(game) {
        var correct = 'guess TIME AFTER TIME';
        return req.p({
          username: users.invited.number,
          message: correct 
        }, params, true);
      }).then(function() {
        // invited should be in a waiting-for-round state
        return Promise.join(
          req.p({
          username: users.invited.number,
          message: 'foo' 
        }, params, true),
        Message.get('says', [users.invited.nickname, 'foo']),
        function(output, says) {
          console.log('response back', output.Response);
          // we expect these to be in order, too
          output.Response.Sms.length.should.equal(2);

          var expectations = [
              users.inviter.number,
              users.secondInvited.number,
          ];
          output.Response.Sms.splice(0, 2).map(function(sms) {
            says.message.should.equal(sms['_']);
            expect(expectations).to.contain(sms['$']['to']);
            // once a user has been messaged, they shouldn't
            // receive it a second time
            if ( sms['$']['to'] === users.inviter.number ) {
              delete expectations[0];
            } else if ( sms['$']['to'] === users.inviter.number ) {
              delete expectations[1];
            }
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

  function jumpIntoThirdRound(users) {
    return startGame(users).then(function(game) {
      // second user says yes
      return req.p({
        username: users.inviter.number,
        message: 'invite '+users.secondInvited.number,
      }, params).then(function() {
        return req.p({
          username: users.secondInvited.number,
          message: 'yes' 
        }, params);
      }).then(function() {
        // second user is in the game
        return req.p({
          username: users.secondInvited.number,
          message: users.secondInvited.nickname
        }, params, true)
      }).then(function() {
        // first user submits their emoji
        return req.p({
          username: users.inviter.number,
          message: JURASSIC_PARK 
        }, params, true)
      }).then(function() {
        // third user guesses
        return req.p({
          username: users.secondInvited.number,
          message: 'guess Jurassic Park' 
        }, params, true);
      }).then(function(output) {
        // second user submits their emoji
        return req.p({
          username: users.invited.number,
          message: SILENCE_OF_THE_LAMBS 
        }, params, true)
      }).then(function() {
        // third user guesses
        return req.p({
          username: users.secondInvited.number,
          message: 'guess Silence of the Lambs' 
        }, params, true);
      }).then(function() {
        // third user submits their emoji
        return req.p({
          username: users.secondInvited.number,
          message: TIME_AFTER_TIME 
        }, params, true);
      }).then(function() {
        return game;
      });
    });
  }
}
