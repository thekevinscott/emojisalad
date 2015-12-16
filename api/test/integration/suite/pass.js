'use strict';
/*
 * Tests that passing during a round works
 *
 */

const Game = require('../../../models/game');
//const Player = require('../../../models/player');
const getPlayers = require('../lib/getPlayers');
const getScore = require('../lib/getScore');
const startGame = require('../flows/startGame');
const playGame = require('../flows/playGame');
//const invite = require('../flows/invite');
const check = require('../lib/check');
const setup = require('../lib/setup');
const rand = require('../lib/getRandomScore');
const rule = require('../../../config/rule');
const clue = rule('clue').example();
const pass = rule('pass').example();
const EMOJI = '😀';
const guess = rule('guess').example();

let defaults = {
  'win-guesser-1': rand(),
  'win-submitter-1': rand(),
  'win-guesser-2': rand(),
  'win-submitter-2': rand(),
  'pass': rand()
};

describe('Pass', function() {
  describe('Illegal', function() {
    it('should not let a player pass when they are not guessing', function() {
      var players = getPlayers(3);
      return startGame(players).then(function() {
        return check(
          { player: players[1], msg: pass },
          [
            { to: players[1], key: 'pass-rejected-not-playing' }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    //it('should not let a submitter pass when guessing', function() {
      //var players = getPlayers(3);
      //return startGame(players).then(function() {
        //return check(
          //{ player: players[0], msg: pass },
          //[
            //{ to: players[0], key: 'pass-rejected-need-a-guess' }
          //]
        //).then(function(obj) {
          //obj.output.should.deep.equal(obj.expected);
        //});
      //});
    //});

    it('should not let a submitter pass when waiting for others to guess', function() {
      var players = getPlayers(3);
      return playGame(players).then(function() {
        return check(
          { player: players[0], msg: pass },
          [
            { to: players[0], key: 'pass-rejected-not-guessing' }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should not let a player ask for a clue if they have passed', function() {
      var players = getPlayers(3);
      return playGame(players).then(function() {
        return setup([
          { player: players[1], msg: pass }
        ]);
      }).then(function() {
        return check(
          { player: players[1], msg: clue },
          [
            { to: players[1], key: 'no-clue-after-passing' }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    /*
    it('should not let a player pass if they have run out of guesses', function() {
      var players = getPlayers(3);
      return playGame(players).then(function(game) {
        return setup(exhaustGuesses(game, players[1]));
      }).then(function() {
        return check(
          { player: players[1], msg: pass },
          [
            { to: players[1], key: 'no-pass-after-loss' }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
    */

    it('should not let a player guess if they have already passed', function() {
      var players = getPlayers(3);
      return playGame(players).then(function() {
        return setup({ player: players[1], msg: pass });
      }).then(function() {
        return check(
          { player: players[1], msg: guess + EMOJI },
          [
            { to: players[1], key: 'no-guessing-after-passing' }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
  });

  describe('Legal', function() {
    it('should let a player pass during a round and allow the round to continue', function() {
      var players = getPlayers(3);
      return playGame(players).then(function(game) {
        return check(
          { player: players[1], msg: pass },
          [
            { to: players[0], key: 'player-passed', options: [game.round.players[0].nickname] },
            { to: players[1], key: 'pass', options: [game.round.players[0].nickname] },
            { to: players[2], key: 'player-passed', options: [game.round.players[0].nickname] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should let a player pass during a round and end the round if there are no more players', function() {
      var players = getPlayers(2);
      var lastClue = 'JURASSIC PARK';
      var nextClue = 'SILENCE OF THE LAMBS';
      return playGame(players).then(function() {
        return check(
          { player: players[1], msg: pass },
          [
            { to: players[0], key: 'player-passed', options: [ players[1].nickname ]},
            { to: players[1], key: 'pass', options: [ players[1].nickname ]},
            { to: players[0], key: 'round-over', options: [lastClue] },
            { to: players[1], key: 'round-over', options: [lastClue] },
            { to: players[0], key: 'game-next-round', options: [ players[1].nickname ]},
            { to: players[1], key: 'game-next-round-suggestion', options: [ players[1].nickname, nextClue ]},
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    /*
    it('should end a round if one player is out of guesses and the other player passes', function() {
      var players = getPlayers(3);
      var nextClue = 'SILENCE OF THE LAMBS';
      return playGame(players).then(function(game) {
        return setup(exhaustGuesses(game, players[2]));
      }).then(function() {
        return check(
          { player: players[1], msg: pass },
          [
            { to: players[0], key: 'player-passed', options: [ players[1].nickname ]},
            { to: players[1], key: 'pass', options: [ players[1].nickname ]},
            { to: players[2], key: 'player-passed', options: [ players[1].nickname ]},
            { to: players[0], key: 'round-over' },
            { to: players[1], key: 'round-over' },
            { to: players[2], key: 'round-over' },
            { to: players[0], key: 'game-next-round', options: [ players[1].nickname ]},
            { to: players[1], key: 'game-next-round-suggestion', options: [ players[1].nickname, nextClue]},
            { to: players[2], key: 'game-next-round', options: [ players[1].nickname ]},
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
   */

    it('should allow the second player to guess successfully after the first player passes', function() {
      var players = getPlayers(3);
      var nextClue = 'SILENCE OF THE LAMBS';
      var firstClue = 'JURASSIC PARK';
      return playGame(players).then(function(game) {
        return Game.updateDefaultScores(game, defaults).then(function() {
          return setup([
            { player: players[2], msg: pass }
          ]);
        }).then(function() {
          return game;
        });
      }).then(function(game) {
        let updates = {};
        updates[players[2].nickname] = defaults.pass;
        updates[players[1].nickname] = defaults['win-guesser-1'];
        updates[players[0].nickname] = defaults['win-submitter-1'];
        let score = getScore(game, updates);
        return check(
          { player: players[1], msg: guess + firstClue },
          [
            { to: players[0], key: 'guesses', options: [players[1].nickname, firstClue] },
            { to: players[2], key: 'guesses', options: [players[1].nickname, firstClue] },
            { to: players[0], key: 'correct-guess', options: [players[1].nickname, game.round.phrase, score] },
            { to: players[1], key: 'correct-guess', options: [players[1].nickname, game.round.phrase, score] },
            { to: players[2], key: 'correct-guess', options: [players[1].nickname, game.round.phrase, score] },
            { to: players[0], key: 'game-next-round', options: [players[1].nickname] },
            { to: players[1], key: 'game-next-round-suggestion', options: [players[1].nickname, nextClue] },
            { to: players[2], key: 'game-next-round', options: [players[1].nickname] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    /*
    it('should end a round if one player passes and the other player runs out of guesses', function() {
      var players = getPlayers(3);
      var nextClue = 'SILENCE OF THE LAMBS';
      //var firstClue = 'JURASSIC PARK';
      return playGame(players).then(function(game) {
        var promises = [
          { player: players[2], msg: pass },
        ];

        for ( var i=0;i<game.round.guesses-1;i++ ) {
          promises.push({ player: players[1], msg: guess + EMOJI });
        }

        return setup(promises);
      }).then(function() {
        return check(
          { player: players[1], msg: guess + EMOJI },
          [
            { to: players[0], key: 'guesses', options: [players[1].nickname, EMOJI] },
            { to: players[2], key: 'guesses', options: [players[1].nickname, EMOJI] },
            { to: players[0], key: 'round-over' },
            { to: players[1], key: 'round-over' },
            { to: players[2], key: 'round-over' },
            { to: players[0], key: 'game-next-round', options: [players[1].nickname] },
            { to: players[1], key: 'game-next-round-suggestion', options: [players[1].nickname, nextClue] },
            { to: players[2], key: 'game-next-round', options: [players[1].nickname] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
    */

    it('should end a round if both players pass', function() {
      var players = getPlayers(3);
      var nextClue = 'SILENCE OF THE LAMBS';
      //var firstClue = 'JURASSIC PARK';
      return playGame(players).then(function() {
        return setup([
          { player: players[2], msg: pass },
        ]);
      }).then(function() {
        return check(
          { player: players[1], msg: pass },
          [
            { to: players[0], key: 'player-passed', options: [ players[1].nickname ]},
            { to: players[1], key: 'pass', options: [ players[1].nickname ]},
            { to: players[2], key: 'player-passed', options: [ players[1].nickname ]},
            { to: players[0], key: 'round-over' },
            { to: players[1], key: 'round-over' },
            { to: players[2], key: 'round-over' },
            { to: players[0], key: 'game-next-round', options: [players[1].nickname] },
            { to: players[1], key: 'game-next-round-suggestion', options: [players[1].nickname, nextClue] },
            { to: players[2], key: 'game-next-round', options: [players[1].nickname] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should allow a game to move on if everyone passes', function() {
      var players = getPlayers(3);
      //var nextClue = 'SILENCE OF THE LAMBS';
      return playGame(players).then(function() {
        return setup([
          { player: players[2], msg: pass },
          { player: players[1], msg: pass },
        ]);
      }).then(function() {
        return check(
          { player: players[1], msg: EMOJI },
          [
            { to: players[1], key: 'game-submission-sent'},
            { to: players[0], key: 'says', options: [players[1].nickname, EMOJI] },
            { to: players[2], key: 'says', options: [players[1].nickname, EMOJI] },
            { to: players[0], key: 'guessing-instructions' },
            { to: players[2], key: 'guessing-instructions' }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should allow an initiator to pass', function() {
      var players = getPlayers(3);
      var nextClue = 'SILENCE OF THE LAMBS';
      return startGame(players).then(function() {
        return check(
          { player: players[0], msg: pass },
          [
            { to: players[0], key: 'pass-initiator' },
            { to: players[1], key: 'player-passed', options: [players[0].nickname] },
            { to: players[2], key: 'player-passed', options: [players[0].nickname] },

            { to: players[0], key: 'game-next-round', options: [players[1].nickname] },
            { to: players[1], key: 'game-next-round-suggestion', options: [players[1].nickname, nextClue] },
            { to: players[2], key: 'game-next-round', options: [players[1].nickname] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
  });
});

function exhaustGuesses(game, player) {
  var guesses = [];
  for ( var i=0;i<game.round.guesses;i++ ) {
    guesses.push({ player: player, msg: guess + EMOJI });
  }
  return guesses;
}
