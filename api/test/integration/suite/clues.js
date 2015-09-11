/*
 * Tests that clues work
 *
 */

var expect = require('chai').expect;
var req = require('./lib/req');
var Message = require('../../../models/Message');
var Round = require('../../../models/Round');
var sprint = require('sprintf');
var Promise = require('bluebird');

var getUsers = require('./lib/getUsers');
var startGame = require('./flows/startGame');
var playGame = require('./flows/playGame');
var setup = require('./lib/setup');
var check = require('./lib/check');

var EMOJI = '😀';

module.exports = function(params) {
  var r = {
    q: function() {
      return req.q(null, params);
    },
    p: function(opts) {
      return req.p(opts, params );
    }
  }
  var numbers = [];

  describe('Clues', function() {
    this.timeout(60000);
    var msg = 'Jurassic Park';
    var msg2 = 'SILENCE OF THE LAMBS';

    it.only('should notify all the other users when somebody asks for a clue', function() {
      var users = getUsers(3);

      return playGame(users).then(function() {
        return check(
          { user: users[1], msg: 'CLUE' },
          [
            { key: 'says', options: [users[1].nickname, 'CLUE'], to: users[0] },
            { key: 'says', options: [users[1].nickname, 'CLUE'], to: users[2] },
            { key: 'clue', options: [users[1].nickname, 'MOVIE'], to: users[0] },
            { key: 'clue', options: [users[1].nickname, 'MOVIE'], to: users[1] },
            { key: 'clue', options: [users[1].nickname, 'MOVIE'], to: users[2] }
          ]
        ).then(function(obj) {
          //console.log('output', obj.output);
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should allow a user to ask for a second clue', function() {
      var users = getUsers(3);
      var clueMsg = 'CLEVER GIRL';

      return startGame(users).then(function(game) {
        return Round.update(game.round, {
          clues_allowed: 2
        }).then(function() {
          return game;
        });
      }).then(function(game) {
        return req.p({
          username: game.round.submitter.number,
          message: EMOJI.JURASSIC_PARK 
        }, params, true).then(function() {
          return req.p({
            username: game.round.players[0].number,
            message: 'CLUE'
          }, params, true);
        }).then(function() {
          return game;
        });
      }).then(function(game) {
        return Promise.join(
          req.p({
            username: game.round.players[0].number,
            message: 'CLUE'
          }, params, true),
          Message.get(['says'], [game.round.players[0].nickname, 'CLUE']),
          Message.get(['clue'], [game.round.players[0].nickname, clueMsg ] ),
          function(output, says, clue) {
            output.Response.Sms.length.should.equal(5);
            output.Response.Sms.splice(0,2).map(function(sms) {
              sms['_'].should.equal(says.message);
              game.players.map(function(player) {
                if ( player.id !== game.round.players[0].id ) {
                  return player.number;
                }
              }).should.contain(sms['$']['to']);
            });
            output.Response.Sms.splice(0,3).map(function(sms) {
              sms['_'].should.equal(clue.message);
              game.players.map(function(player) {
                return player.number
              }).should.contain(sms['$']['to']);
            });
          }
        );
      });
    });

    it('should allow a second user to ask for a second clue', function() {
      var users = getUsers(3);
      var clueMsg = 'CLEVER GIRL';

      return startGame(users).then(function(game) {
        return Round.update(game.round, {
          clues_allowed: 2
        }).then(function() {
          return game;
        });
      }).then(function(game) {
        return req.p({
          username: game.round.submitter.number,
          message: EMOJI.JURASSIC_PARK 
        }, params, true).then(function() {
          return req.p({
            username: game.round.players[0].number,
            message: 'CLUE'
          }, params, true);
        }).then(function() {
          return game;
        });
      }).then(function(game) {
        return Promise.join(
          req.p({
            username: game.round.players[1].number,
            message: 'CLUE'
          }, params, true),
          Message.get(['says'], [game.round.players[1].nickname, 'CLUE']),
          Message.get(['clue'], [game.round.players[1].nickname, clueMsg ] ),
          function(output, says, clue) {
            output.Response.Sms.length.should.equal(5);
            output.Response.Sms.splice(0,2).map(function(sms) {
              sms['_'].should.equal(says.message);
              game.players.map(function(player) {
                if ( player.id !== game.round.players[1].id ) {
                  return player.number;
                }
              }).should.contain(sms['$']['to']);
            });
            output.Response.Sms.splice(0,3).map(function(sms) {
              sms['_'].should.equal(clue.message);
              game.players.map(function(player) {
                return player.number
              }).should.contain(sms['$']['to']);
            });
          }
        );
      });
    });

    it('should not allow the submitter to ask for a clue', function() {
      var users = getUsers(3);
      var clueMsg = 'CLEVER GIRL';

      return startGame(users).then(function(game) {
        return req.p({
          username: game.round.submitter.number,
          message: EMOJI.JURASSIC_PARK 
        }, params, true).then(function() {
          return game;
        });
      }).then(function(game) {
        return Promise.join(
          req.p({
          username: game.round.submitter.number,
          message: 'CLUE' 
          }, params, true),
          Message.get(['says'], [game.round.submitter.nickname, 'CLUE']),
          Message.get(['no-clue-for-submitter']),
          function(output, says, noClue) {
            output.Response.Sms.length.should.equal(5);
            output.Response.Sms.splice(0,2).map(function(sms) {
              sms['_'].should.equal(says.message);
              game.players.map(function(player) {
                if ( player.id !== game.round.submitter.id ) {
                  return player.number;
                }
              }).should.contain(sms['$']['to']);
            });
            output.Response.Sms.splice(0,3).map(function(sms) {
              sms['_'].should.equal(noClue.message);
              game.players.map(function(player) {
                return player.number
              }).should.contain(sms['$']['to']);
            });
          }
        );
      });
    });

    it('should not allow more than two clues', function() {
      var users = getUsers(3);
      var clueMsg = 'CLEVER GIRL';

      return startGame(users).then(function(game) {
        return Round.update(game.round, {
          clues_allowed: 2
        }).then(function() {
          return game;
        });
      }).then(function(game) {
        return req.p({
          username: game.round.submitter.number,
          message: EMOJI.JURASSIC_PARK 
        }, params, true).then(function() {
          return req.p({
            username: game.round.players[0].number,
            message: 'CLUE'
          }, params, true);
        }).then(function() {
          return req.p({
            username: game.round.players[1].number,
            message: 'CLUE'
          }, params, true);
        }).then(function() {
          return game;
        });
      }).then(function(game) {
        return Promise.join(
          req.p({
            username: game.round.players[1].number,
            message: 'CLUE'
          }, params, true),
          Message.get(['says'], [game.round.players[1].nickname, 'CLUE']),
          Message.get(['no-more-clues-allowed'], [ '2 clues'] ),
          function(output, says, clue) {
            output.Response.Sms.length.should.equal(5);
            output.Response.Sms.splice(0,2).map(function(sms) {
              sms['_'].should.equal(says.message);
              game.players.map(function(player) {
                if ( player.id !== game.round.players[1].id ) {
                  return player.number;
                }
              }).should.contain(sms['$']['to']);
            });
            output.Response.Sms.splice(0,3).map(function(sms) {
              sms['_'].should.equal(clue.message);
              game.players.map(function(player) {
                return player.number
              }).should.contain(sms['$']['to']);
            });
          }
        );
      });
    });

    it('should not allow more than one clue if the round clue_allowed field only allows 1', function() {
      var users = getUsers(3);
      var clueMsg = 'CLEVER GIRL';

      return startGame(users).then(function(game) {
        return req.p({
          username: game.round.submitter.number,
          message: EMOJI.JURASSIC_PARK 
        }, params, true).then(function() {
          return req.p({
            username: game.round.players[0].number,
            message: 'CLUE'
          }, params, true);
        }).then(function() {
          return Round.update(game.round, {
            clues_allowed: 1
          });
        }).then(function() {
          return game;
        });
      }).then(function(game) {
        return Promise.join(
          req.p({
            username: game.round.players[1].number,
            message: 'CLUE'
          }, params, true),
          Message.get(['says'], [game.round.players[1].nickname, 'CLUE']),
          Message.get(['no-more-clues-allowed'], [ '1 clue'] ),
          function(output, says, clue) {
            output.Response.Sms.length.should.equal(5);
            output.Response.Sms.splice(0,2).map(function(sms) {
              sms['_'].should.equal(says.message);
              game.players.map(function(player) {
                if ( player.id !== game.round.players[1].id ) {
                  return player.number;
                }
              }).should.contain(sms['$']['to']);
            });
            output.Response.Sms.splice(0,3).map(function(sms) {
              sms['_'].should.equal(clue.message);
              game.players.map(function(player) {
                return player.number
              }).should.contain(sms['$']['to']);
            });
          }
        );
      });
    });

    it('should fail gracefully if no more clues exist', function() {
      var users = getUsers(3);
      var clueMsg = 'CLEVER GIRL';

      return startGame(users).then(function(game) {
        return req.p({
          username: game.round.submitter.number,
          message: EMOJI.JURASSIC_PARK 
        }, params, true).then(function() {
          return Round.update(game.round, {
            clues_allowed: 99 
          });
        }).then(function() {
          return req.p({
            username: game.round.players[1].number,
            message: 'CLUE'
          }, params, true);
        }).then(function() {
          return req.p({
            username: game.round.players[1].number,
            message: 'CLUE'
          }, params, true);
        }).then(function() {
          return req.p({
            username: game.round.players[1].number,
            message: 'CLUE'
          }, params, true);
        }).then(function() {
          return game;
        });
      }).then(function(game) {
        return Promise.join(
          req.p({
            username: game.round.players[1].number,
            message: 'CLUE'
          }, params, true),
          Message.get(['says'], [game.round.players[1].nickname, 'CLUE']),
          Message.get(['no-more-clues-available']),
          function(output, says, clue) {
            output.Response.Sms.length.should.equal(5);
            output.Response.Sms.splice(0,2).map(function(sms) {
              sms['_'].should.equal(says.message);
              game.players.map(function(player) {
                if ( player.id !== game.round.players[1].id ) {
                  return player.number;
                }
              }).should.contain(sms['$']['to']);
            });
            output.Response.Sms.splice(0,3).map(function(sms) {
              sms['_'].should.equal(clue.message);
              game.players.map(function(player) {
                return player.number
              }).should.contain(sms['$']['to']);
            });
          }
        );
      });
    });
  });



  function jumpIntoThirdRound(users) {
    return startGame(users).then(function(game) {
      // second user says yes
      return req.p({
        username: users[0].number,
        message: 'invite '+users[2].number,
      }, params).then(function() {
        return req.p({
          username: users[2].number,
          message: 'yes' 
        }, params);
      }).then(function() {
        // second user is in the game
        return req.p({
          username: users[2].number,
          message: users[2].nickname
        }, params, true)
      }).then(function() {
        // first user submits their emoji
        return req.p({
          username: users[0].number,
          message: EMOJI.JURASSIC_PARK 
        }, params, true)
      }).then(function() {
        // third user guesses
        return req.p({
          username: users[2].number,
          message: 'guess Jurassic Park' 
        }, params, true);
      }).then(function(output) {
        // second user submits their emoji
        return req.p({
          username: users[1].number,
          message: SILENCE_OF_THE_LAMBS 
        }, params, true)
      }).then(function() {
        // third user guesses
        return req.p({
          username: users[2].number,
          message: 'guess Silence of the Lambs' 
        }, params, true);
      }).then(function() {
        // third user submits their emoji
        return req.p({
          username: users[2].number,
          message: TIME_AFTER_TIME 
        }, params, true);
      }).then(function() {
        return game;
      });
    });
  }
}

