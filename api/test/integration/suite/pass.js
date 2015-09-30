'use strict';
/*
 * Tests that passing during a round works
 *
 */

//const Game = require('../../../models/game');
//const User = require('../../../models/user');
const getUsers = require('../lib/getUsers');
const startGame = require('../flows/startGame');
const playGame = require('../flows/playGame');
//const invite = require('../flows/invite');
const check = require('../lib/check');
const setup = require('../lib/setup');
const rule = require('../../../config/rule');
const clue = rule('clue').example();
const pass = rule('pass').example();
var submission = rule('submission').example();
const EMOJI = '😀';
const guess = rule('guess').example();

describe('Pass', function() {
  describe('Illegal', function() {
    it('should not let a player pass when they are not guessing', function() {
      var users = getUsers(3);
      return startGame(users).then(function(game) {
        return check(
          { user: game.round.players[0], msg: pass },
          [
            { to: game.round.players[0], key: 'pass-rejected-not-playing' }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should not let a submitter pass when guessing', function() {
      var users = getUsers(3);
      return startGame(users).then(function(game) {
        return check(
          { user: game.round.submitter, msg: pass },
          [
            { to: game.round.submitter, key: 'pass-rejected-need-a-guess' }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should not let a submitter pass when waiting for others to guess', function() {
      var users = getUsers(3);
      return playGame(users).then(function(game) {
        return check(
          { user: game.round.submitter, msg: pass },
          [
            { to: game.round.submitter, key: 'pass-rejected-not-guessing' }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should not let a user ask for a clue if they have passed', function() {
      var users = getUsers(3);
      return playGame(users).then(function() {
        return setup([
          { user: users[1], msg: pass }
        ]);
      }).then(function() {
        return check(
          { user: users[1], msg: clue },
          [
            { to: users[1], key: 'no-clue-after-passing' }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should not let a user pass if they have run out of guesses', function() {
      var users = getUsers(3);
      return playGame(users).then(function(game) {
        return setup(exhaustGuesses(game, users[1]));
      }).then(function() {
        return check(
          { user: users[1], msg: pass },
          [
            { to: users[1], key: 'no-pass-after-loss' }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should not let a user guess if they have already passed', function() {
      var users = getUsers(3);
      return playGame(users).then(function() {
        return setup({ user: users[1], msg: pass });
      }).then(function() {
        return check(
          { user: users[1], msg: guess + EMOJI },
          [
            { to: users[1], key: 'no-guessing-after-passing' }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
  });

  describe('Legal', function() {
    it('should let a player pass during a round and allow the round to continue', function() {
      var users = getUsers(3);
      return playGame(users).then(function(game) {
        return check(
          { user: game.round.players[0], msg: pass },
          [
            { to: users[0], key: 'user-passed', options: [game.round.players[0].nickname] },
            { to: users[1], key: 'pass', options: [game.round.players[0].nickname] },
            { to: users[2], key: 'user-passed', options: [game.round.players[0].nickname] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should let a player pass during a round and end the round if there are no more players', function() {
      var users = getUsers(2);
      var nextClue = 'SILENCE OF THE LAMBS';
      return playGame(users).then(function() {
        return check(
          { user: users[1], msg: pass },
          [
            { to: users[0], key: 'user-passed', options: [ users[1].nickname ]},
            { to: users[1], key: 'pass', options: [ users[1].nickname ]},
            { to: users[0], key: 'round-over' },
            { to: users[1], key: 'round-over' },
            { to: users[0], key: 'game-next-round', options: [ users[1].nickname ]},
            { to: users[1], key: 'game-next-round-suggestion', options: [ users[1].nickname, nextClue ]},
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should end a round if one player is out of guesses and the other player passes', function() {
      var users = getUsers(3);
      var nextClue = 'SILENCE OF THE LAMBS';
      return playGame(users).then(function(game) {
        return setup(exhaustGuesses(game, users[2]));
      }).then(function() {
        return check(
          { user: users[1], msg: pass },
          [
            { to: users[0], key: 'user-passed', options: [ users[1].nickname ]},
            { to: users[1], key: 'pass', options: [ users[1].nickname ]},
            { to: users[2], key: 'user-passed', options: [ users[1].nickname ]},
            { to: users[0], key: 'round-over' },
            { to: users[1], key: 'round-over' },
            { to: users[2], key: 'round-over' },
            { to: users[0], key: 'game-next-round', options: [ users[1].nickname ]},
            { to: users[1], key: 'game-next-round-suggestion', options: [ users[1].nickname, nextClue]},
            { to: users[2], key: 'game-next-round', options: [ users[1].nickname ]},
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should allow the second player to guess successfully after the first player passes', function() {
      var users = getUsers(3);
      var nextClue = 'SILENCE OF THE LAMBS';
      var firstClue = 'JURASSIC PARK';
      return playGame(users).then(function() {
        return setup([
          { user: users[2], msg: pass }
        ]);
      }).then(function() {
        return check(
          { user: users[1], msg: guess + firstClue },
          [
            { to: users[0], key: 'guesses', options: [users[1].nickname, firstClue] },
            { to: users[2], key: 'guesses', options: [users[1].nickname, firstClue] },
            { to: users[0], key: 'correct-guess', options: [users[1].nickname] },
            { to: users[1], key: 'correct-guess', options: [users[1].nickname] },
            { to: users[2], key: 'correct-guess', options: [users[1].nickname] },
            { to: users[0], key: 'game-next-round', options: [users[1].nickname] },
            { to: users[1], key: 'game-next-round-suggestion', options: [users[1].nickname, nextClue] },
            { to: users[2], key: 'game-next-round', options: [users[1].nickname] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should end a round if one player passes and the other player runs out of guesses', function() {
      var users = getUsers(3);
      var nextClue = 'SILENCE OF THE LAMBS';
      //var firstClue = 'JURASSIC PARK';
      return playGame(users).then(function(game) {
        var promises = [
          { user: users[2], msg: pass },
        ];

        for ( var i=0;i<game.round.guesses-1;i++ ) {
          promises.push({ user: users[1], msg: guess + EMOJI });
        }

        return setup(promises);
      }).then(function() {
        return check(
          { user: users[1], msg: guess + EMOJI },
          [
            { to: users[0], key: 'guesses', options: [users[1].nickname, EMOJI] },
            { to: users[2], key: 'guesses', options: [users[1].nickname, EMOJI] },
            { to: users[0], key: 'round-over' },
            { to: users[1], key: 'round-over' },
            { to: users[2], key: 'round-over' },
            { to: users[0], key: 'game-next-round', options: [users[1].nickname] },
            { to: users[1], key: 'game-next-round-suggestion', options: [users[1].nickname, nextClue] },
            { to: users[2], key: 'game-next-round', options: [users[1].nickname] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should end a round if both players pass', function() {
      var users = getUsers(3);
      var nextClue = 'SILENCE OF THE LAMBS';
      //var firstClue = 'JURASSIC PARK';
      return playGame(users).then(function() {
        return setup([
          { user: users[2], msg: pass },
        ]);
      }).then(function() {
        return check(
          { user: users[1], msg: pass },
          [
            { to: users[0], key: 'user-passed', options: [ users[1].nickname ]},
            { to: users[1], key: 'pass', options: [ users[1].nickname ]},
            { to: users[2], key: 'user-passed', options: [ users[1].nickname ]},
            { to: users[0], key: 'round-over' },
            { to: users[1], key: 'round-over' },
            { to: users[2], key: 'round-over' },
            { to: users[0], key: 'game-next-round', options: [users[1].nickname] },
            { to: users[1], key: 'game-next-round-suggestion', options: [users[1].nickname, nextClue] },
            { to: users[2], key: 'game-next-round', options: [users[1].nickname] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should allow a game to move on if everyone passes', function() {
      var users = getUsers(3);
      //var nextClue = 'SILENCE OF THE LAMBS';
      return playGame(users).then(function() {
        return setup([
          { user: users[2], msg: pass },
          { user: users[1], msg: pass },
        ]);
      }).then(function() {
        return check(
          { user: users[1], msg: submission + EMOJI },
          [
            { to: users[1], key: 'game-submission-sent'},
            { to: users[0], key: 'says', options: [users[1].nickname, EMOJI] },
            { to: users[2], key: 'says', options: [users[1].nickname, EMOJI] },
            { to: users[0], key: 'guessing-instructions' },
            { to: users[2], key: 'guessing-instructions' }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
  });
});

function exhaustGuesses(game, user) {
  var guesses = [];
  for ( var i=0;i<game.round.guesses;i++ ) {
    guesses.push({ user: user, msg: guess + EMOJI });
  }
  return guesses;
}
