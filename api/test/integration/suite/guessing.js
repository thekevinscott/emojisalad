/*
 * Tests that guessing works
 *
 */

var expect = require('chai').expect;

var getUsers = require('../lib/getUsers');
var playGame = require('../flows/playGame');
var setup = require('../lib/setup');
var check = require('../lib/check');

describe('Guessing', function() {
  this.timeout(60000);

  it('should be able to successfully guess', function() {
    var users = getUsers(3);

    return playGame(users).then(function(game) {
      var msg2 = 'SILENCE OF THE LAMBS';
      var guess = 'guess '+game.round.phrase;
      return check(
        { user: users[1], msg: guess },
        [
          { key: 'says', options: [users[1].nickname, guess], to: users[0] },
          { key: 'says', options: [users[1].nickname, guess], to: users[2] },
          { key: 'correct-guess', options: [users[1].nickname], to: users[0] },
          { key: 'correct-guess', options: [users[1].nickname], to: users[1] },
          { key: 'correct-guess', options: [users[1].nickname], to: users[2] },
          { key: 'game-next-round', options: [users[1].nickname], to: users[0] },
          { key: 'game-next-round-suggestion', options: [users[1].nickname, msg2], to: users[1] },
          { key: 'game-next-round', options: [users[1].nickname], to: users[2] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

  });

  it('should be able to successfully guess with case insensitivity', function() {
    var users = getUsers(3);

    return playGame(users).then(function(game) {
      var msg2 = 'SILENCE OF THE LAMBS';
      var guess = 'guess '+game.round.phrase.toLowerCase();
      return check(
        { user: users[1], msg: guess },
        [
          { key: 'says', options: [users[1].nickname, guess], to: users[0] },
          { key: 'says', options: [users[1].nickname, guess], to: users[2] },
          { key: 'correct-guess', options: [users[1].nickname], to: users[0] },
          { key: 'correct-guess', options: [users[1].nickname], to: users[1] },
          { key: 'correct-guess', options: [users[1].nickname], to: users[2] },
          { key: 'game-next-round', options: [users[1].nickname], to: users[0] },
          { key: 'game-next-round-suggestion', options: [users[1].nickname, msg2], to: users[1] },
          { key: 'game-next-round', options: [users[1].nickname], to: users[2] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it.only('should be notified on an incorrect guess', function() {
    var users = getUsers(3);

    return playGame(users).then(function(game) {
      var msg2 = 'SILENCE OF THE LAMBS';
      var guess = 'guess foo';
      return check(
        { user: users[1], msg: guess },
        [
          { key: 'says', options: [users[1].nickname, guess], to: users[0] },
          { key: 'says', options: [users[1].nickname, guess], to: users[2] },
          { key: 'incorrect-guess', options: [users[1].nickname], to: users[0] },
          { key: 'incorrect-guess', options: [users[1].nickname], to: users[1] },
          { key: 'incorrect-guess', options: [users[1].nickname], to: users[2] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it.only('should send a sad message when you run out of guesses', function() {
    var users = getUsers(3);

    return playGame(users).then(function(game) {
      var msg2 = 'SILENCE OF THE LAMBS';
      var guess = 'guess foo';
      return check(
        { user: users[1], msg: guess },
        [
          { key: 'says', options: [users[1].nickname, guess], to: users[0] },
          { key: 'says', options: [users[1].nickname, guess], to: users[2] },
          { key: 'incorrect-guess', options: [users[1].nickname], to: users[0] },
          { key: 'incorrect-guess', options: [users[1].nickname], to: users[1] },
          { key: 'incorrect-guess', options: [users[1].nickname], to: users[2] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
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
