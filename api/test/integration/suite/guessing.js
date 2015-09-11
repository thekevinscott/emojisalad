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
  var msg2 = 'SILENCE OF THE LAMBS';

  describe('Guessing', function() {
    this.timeout(60000);

    it('should be able to successfully guess', function() {
      var users = getUsers();

      return startGame(users).then(function(game) {
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
              output.Response.Sms.length.should.equal(8);

              output.Response.Sms.map(function(sms) {
                if ( sms['$']['to'] === users.invited.number ) {
                  // this is the user who guessed
                  expect([
                    correct.message,
                    suggestion.message
                  ]).to.contain(sms['_']);
                } else if ( sms['$']['to'] === users.inviter.number ) {
                  expect([
                    says.message,
                    correct.message,
                    nextRound.message
                  ]).to.contain(sms['_']);
                } else if ( sms['$']['to'] === users.secondInvited.number ) {
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

    it('should be able to successfully guess with case insensitivity', function() {
      var users = getUsers();

      return startGame(users).then(function(game) {
        var correct = 'GuesS JurassiC ParK';

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
              output.Response.Sms.length.should.equal(8);

              output.Response.Sms.map(function(sms) {
                if ( sms['$']['to'] === users.invited.number ) {
                  // this is the user who guessed
                  expect([
                    correct.message,
                    suggestion.message
                  ]).to.contain(sms['_']);
                } else if ( sms['$']['to'] === users.inviter.number ) {
                  expect([
                    says.message,
                    correct.message,
                    nextRound.message
                  ]).to.contain(sms['_']);
                } else if ( sms['$']['to'] === users.secondInvited.number ) {
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

    it('should be notified on an incorrect guess', function() {
      var users = getUsers();

      return startGame(users).then(function(game) {
        var msg = 'guess foo';
        return Promise.join(
          req.p({
            username: users.invited.number,
            message: msg 
          }, params, true),
          Message.get('says', [users.invited.nickname, msg]),
          Message.get('incorrect-guess', [users.invited.nickname]),
          function(output, says, incorrect) {
            output.Response.Sms.length.should.equal(5);

            output.Response.Sms.map(function(sms) {
              if ( sms['$']['to'] === users.invited.number ) {
                // this is the user who guessed
                sms['_'].should.equal(incorrect.message);
              } else if ( sms['$']['to'] === users.inviter.number ) {
                expect([
                  says.message,
                  incorrect.message,
                ]).to.contain(sms['_']);
              } else if ( sms['$']['to'] === users.secondInvited.number ) {
                expect([
                  says.message,
                  incorrect.message,
                ]).to.contain(sms['_']);
              }
            });
          }
        );
      });
    });

    it('should send a sad message when you run out of guesses', function() {
      var users = getUsers();
      var msg = 'guess foo';

      return startGame(users).then(function(game) {
        return req.p({
          username: users.invited.number,
          message: msg 
        }, params, true);
      }).then(function() {
        return Promise.join(
          req.p({
            username: users.invited.number,
            message: msg 
          }, params, true),
          Message.get('says', [users.invited.nickname, msg]),
          Message.get('incorrect-out-of-guesses'),
          function(output, says, incorrect) {
            output.Response.Sms.length.should.equal(5);

            output.Response.Sms.map(function(sms) {
              if ( sms['$']['to'] === users.invited.number ) {
                // this is the user who guessed
                sms['_'].should.equal(incorrect.message);
              } else if ( sms['$']['to'] === users.inviter.number ) {
                expect([
                  says.message,
                  incorrect.message,
                ]).to.contain(sms['_']);
              } else if ( sms['$']['to'] === users.secondInvited.number ) {
                expect([
                  says.message,
                  incorrect.message,
                ]).to.contain(sms['_']);
              }
            });
          }
        );
      });
    });

    it('should chide you if you continue to guess after running out of guesses', function() {
      var users = getUsers();
      var msg = 'guess foo';

      return startGame(users).then(function(game) {
        return req.p({
          username: users.invited.number,
          message: msg 
        }, params, true);
      }).then(function() {
        return req.p({
          username: users.invited.number,
          message: msg 
        }, params, true);
      }).then(function() {
        return Promise.join(
          req.p({
            username: users.invited.number,
            message: msg 
          }, params, true),
          Message.get('says', [users.invited.nickname, msg]),
          Message.get('out-of-guesses', [users.invited.nickname]),
          function(output, says, incorrect) {
            output.Response.Sms.length.should.equal(5);

            output.Response.Sms.map(function(sms) {
              if ( sms['$']['to'] === users.invited.number ) {
                // this is the user who guessed
                sms['_'].should.equal(incorrect.message);
              } else if ( sms['$']['to'] === users.inviter.number ) {
                expect([
                  says.message,
                  incorrect.message,
                ]).to.contain(sms['_']);
              } else if ( sms['$']['to'] === users.secondInvited.number ) {
                expect([
                  says.message,
                  incorrect.message,
                ]).to.contain(sms['_']);
              }
            });
          }
        );
      });
    });

    it('should allow one user to guess, the other user to guess, and then catch the first user guessing a second time and boot them', function() {
      var users = getUsers();
      var msg = 'guess foo';

      return startGame(users).then(function(game) {
        return req.p({
          username: users.invited.number,
          message: msg 
        }, params, true);
      }).then(function() {
        return req.p({
          username: users.secondInvited.number,
          message: msg 
        }, params, true);
      }).then(function() {
        return req.p({
          username: users.invited.number,
          message: msg 
        }, params, true);
      }).then(function() {
        return Promise.join(
          req.p({
            username: users.invited.number,
            message: msg 
          }, params, true),
          Message.get('says', [users.invited.nickname, msg]),
          Message.get('out-of-guesses', [users.invited.nickname]),
          function(output, says, incorrect) {
            output.Response.Sms.length.should.equal(5);

            output.Response.Sms.map(function(sms) {
              if ( sms['$']['to'] === users.invited.number ) {
                // this is the user who guessed
                sms['_'].should.equal(incorrect.message);
              } else if ( sms['$']['to'] === users.inviter.number ) {
                expect([
                  says.message,
                  incorrect.message,
                ]).to.contain(sms['_']);
              } else if ( sms['$']['to'] === users.secondInvited.number ) {
                expect([
                  says.message,
                  incorrect.message,
                ]).to.contain(sms['_']);
              }
            });
          }
        );
      });
    });

    it('should allow one user to guess, the other user to guess, and then catch the first user guessing a second time and boot them', function() {
      var users = getUsers();
      var msg = 'guess foo';

      return startGame(users).then(function(game) {
        return req.p({
          username: users.invited.number,
          message: msg 
        }, params, true);
      }).then(function() {
        return req.p({
          username: users.secondInvited.number,
          message: msg 
        }, params, true);
      }).then(function() {
        return req.p({
          username: users.invited.number,
          message: msg 
        }, params, true);
      }).then(function() {
        return Promise.join(
          req.p({
            username: users.invited.number,
            message: msg 
          }, params, true),
          Message.get('says', [users.invited.nickname, msg]),
          Message.get('out-of-guesses', [users.invited.nickname]),
          function(output, says, incorrect) {
            output.Response.Sms.length.should.equal(5);

            output.Response.Sms.map(function(sms) {
              if ( sms['$']['to'] === users.invited.number ) {
                // this is the user who guessed
                sms['_'].should.equal(incorrect.message);
              } else if ( sms['$']['to'] === users.inviter.number ) {
                expect([
                  says.message,
                  incorrect.message,
                ]).to.contain(sms['_']);
              } else if ( sms['$']['to'] === users.secondInvited.number ) {
                expect([
                  says.message,
                  incorrect.message,
                ]).to.contain(sms['_']);
              }
            });
          }
        );
      });
    });

    it('should allow a user to fail miserably and the other one can still win', function() {
      var users = getUsers();
      var msg = 'guess foo';

      return startGame(users).then(function(game) {
        return req.p({
          username: users.invited.number,
          message: msg 
        }, params, true);
      }).then(function() {
        return req.p({
          username: users.secondInvited.number,
          message: msg 
        }, params, true);
      }).then(function() {
        return req.p({
          username: users.invited.number,
          message: msg 
        }, params, true);
      }).then(function() {
        return Promise.join(
          req.p({
            username: users.secondInvited.number,
            message: 'guess JURASSIC PARK' 
          }, params, true),
          Message.get('says', [users.secondInvited.nickname, 'guess JURASSIC PARK']),
          Message.get('correct-guess', [users.secondInvited.nickname]),
          Message.get('game-next-round', [users.invited.nickname]),
          Message.get('game-next-round-suggestion', [users.invited.nickname, msg2]),
          function(output, says, correct, nextRound, suggestion) {
            // every player in the game should receive this message
            output.Response.Sms.length.should.equal(8);

            output.Response.Sms.map(function(sms) {
              if ( sms['$']['to'] === users.secondInvited.number ) {
                // this is the user who guessed
                expect([
                  correct.message,
                  nextRound.message
                ]).to.contain(sms['_']);
              } else if ( sms['$']['to'] === users.inviter.number ) {
                expect([
                  says.message,
                  correct.message,
                  nextRound.message
                ]).to.contain(sms['_']);
              } else if ( sms['$']['to'] === users.invited.number ) {
                expect([
                  says.message,
                  suggestion.message,
                  correct.message,
                ]).to.contain(sms['_']);
              }
            });
          }
        );
      });
    });

    it('should really get sad if everyone fails', function() {
      var users = getUsers();
      var msg = 'guess foo';

      return startGame(users).then(function(game) {
        return req.p({
          username: users.invited.number,
          message: msg 
        }, params, true);
      }).then(function() {
        return req.p({
          username: users.secondInvited.number,
          message: msg 
        }, params, true);
      }).then(function() {
        return req.p({
          username: users.invited.number,
          message: msg 
        }, params, true);
      }).then(function() {
        return Promise.join(
          req.p({
            username: users.secondInvited.number,
            message: msg,
          }, params, true),
          Message.get('says', [users.secondInvited.nickname, msg]),
          Message.get('round-over'),
          function(output, says, roundOver) {

            output.Response.Sms.splice(0,2).map(function(sms) {
              sms['_'].should.equal(says.message);
              expect([
                users.invited.number,
                users.inviter.number
              ]).to.contain(sms['$']['to']);
            });

            var expectations = [
              users.inviter.number,
              users.invited.number,
              users.secondInvited.number
            ];
            output.Response.Sms.splice(0, 3).map(function(sms) {
              sms['_'].should.equal(roundOver.message);
              expect(expectations).to.contain(sms['$']['to']);
              if ( sms['$']['to'] === users.inviter.number ) {
                delete expectations[0];
              } else if ( sms['$']['to'] === users.invited.number ) {
                delete expectations[1];
              } else if ( sms['$']['to'] === users.secondInvited.number ) {
                delete expectations[2];
              }
            });

          }
        );
      });
    });

    it('should start a new round when everyone has gotten it wrong', function() {
      var users = getUsers();
      var msg = 'guess foo';

      return startGame(users).then(function(game) {
        return req.p({
          username: users.invited.number,
          message: msg 
        }, params, true);
      }).then(function() {
        return req.p({
          username: users.secondInvited.number,
          message: msg 
        }, params, true);
      }).then(function() {
        return req.p({
          username: users.invited.number,
          message: msg 
        }, params, true);
      }).then(function() {
        return Promise.join(
          req.p({
            username: users.secondInvited.number,
            message: msg,
          }, params, true),
          Message.get('says', [users.secondInvited.nickname, msg]),
          Message.get('round-over'),
          Message.get('game-next-round', [users.invited.nickname]),
          Message.get('game-next-round-suggestion', [users.invited.nickname, msg2]),
          function(output, says, roundOver, nextRound, nextRoundSuggestion) {
            output.Response.Sms.length.should.equal(8);

            output.Response.Sms.splice(0,2).map(function(sms) {
              sms['_'].should.equal(says.message);
              expect([
                users.invited.number,
                users.inviter.number
              ]).to.contain(sms['$']['to']);
            });

            var expectations = [
              users.inviter.number,
              users.invited.number,
              users.secondInvited.number
            ];
            output.Response.Sms.splice(0,3).map(function(sms) {
              sms['_'].should.equal(roundOver.message);
              expect(expectations).to.contain(sms['$']['to']);
              if ( sms['$']['to'] === users.inviter.number ) {
                delete expectations[0];
              } else if ( sms['$']['to'] === users.invited.number ) {
                delete expectations[1];
              } else if ( sms['$']['to'] === users.secondInvited.number ) {
                delete expectations[2];
              }
            });

            output.Response.Sms.map(function(sms) {
              if ( sms['$']['to'] === users.invited.number ) {
                // this is the user who guessed
                sms['_'].should.equal(nextRoundSuggestion.message);
              } else if ( sms['$']['to'] === users.inviter.number ) {
                sms['_'].should.equal(nextRound.message);
              } else if ( sms['$']['to'] === users.secondInvited.number ) {
                sms['_'].should.equal(nextRound.message);
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
        username: users.inviter.number,
        message: 'invite '+users.secondInvited.number,
      }, params);
    }).then(function(response) {
      return req.p({
        username: users.invited.number,
        message: 'yes'
      }, params);
    }).then(function(response) {
      return req.p({
        username: users.secondInvited.number,
        message: 'yes'
      }, params);
    }).then(function(response) {
      return req.p({
        username: users.invited.number,
        message: users.invited.nickname 
      }, params, true);
    }).then(function(response) {
      return req.p({
        username: users.secondInvited.number,
        message: users.secondInvited.nickname 
      }, params, true);
    }).then(function() {
      return req.p({
        username: users.inviter.number,
        message: JURASSIC_PARK 
      }, params, true);
    }).then(function() {
      return User.get( users.inviter );
    }).then(function(user) {
      return Game.get({ user: user }).then(function(game) {
        return Game.update(game, { random: 0 }).then(function() {
          return game;
        });
      });
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
