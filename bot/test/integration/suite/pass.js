'use strict';
/*
 * Tests that passing during a round works
 *
 */

const Game = require('../../../models/game');
//const Player = require('../../../models/player');
const getPlayers = require('../lib/getPlayers');
const startGame = require('../flows/startGame');
const playGame = require('../flows/playGame');
//const invite = require('../flows/invite');
const check = require('../lib/check');
const setup = require('../lib/setup');
const rule = require('../../../config/rule');
const clue = rule('clue').example();
const pass = rule('pass').example();
const EMOJI = '😀';
const guess = rule('guess').example();

describe('Pass', function() {
  describe('Illegal', function() {
    it('should not let a player pass when they are not guessing', function() {
      let players = getPlayers(3);
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
      //let players = getPlayers(3);
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
      let players = getPlayers(3);
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
      let players = getPlayers(3);
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

    it('should not let a player guess if they have already passed', function() {
      let players = getPlayers(3);
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
      let players = getPlayers(3);
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
      let players = getPlayers(2);
      let lastPrompt = 'JURASSIC PARK';
      let nextPrompt = 'SILENCE OF THE LAMBS';
      return playGame(players).then(function() {
        return check(
          { player: players[1], msg: pass },
          [
            { to: players[0], key: 'player-passed', options: [ players[1].nickname ]},
            { to: players[1], key: 'pass', options: [ players[1].nickname ]},
            { to: players[0], key: 'round-over', options: [lastPrompt] },
            { to: players[1], key: 'round-over', options: [lastPrompt] },
            { to: players[0], key: 'game-next-round', options: [ players[1].nickname, players[1].avatar ]},
            { to: players[1], key: 'game-next-round-suggestion', options: [ players[1].nickname, players[1].avatar, nextPrompt ]},
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should allow the second player to guess successfully after the first player passes', function() {
      let players = getPlayers(3);
      let nextClue = 'SILENCE OF THE LAMBS';
      let firstClue = 'JURASSIC PARK';
      return playGame(players).then(function(game) {
        return setup([
          { player: players[2], msg: pass }
        ]).then(function() {
          return game;
        });
      }).then(function(game) {
        return check(
          { player: players[1], msg: guess + firstClue },
          [
            { to: players[0], key: 'says', options: [players[1].nickname, players[1].avatar, firstClue] },
            { to: players[2], key: 'says', options: [players[1].nickname, players[1].avatar, firstClue] },
            { to: players[0], key: 'correct-guess', options: [players[1].nickname, players[1].avatar, game.round.phrase] },
            { to: players[1], key: 'correct-guess', options: [players[1].nickname, players[1].avatar, game.round.phrase] },
            { to: players[2], key: 'correct-guess', options: [players[1].nickname, players[1].avatar, game.round.phrase] },
            { to: players[0], key: 'game-next-round', options: [players[1].nickname, players[1].avatar ] },
            { to: players[1], key: 'game-next-round-suggestion', options: [players[1].nickname, players[1].avatar, nextClue] },
            { to: players[2], key: 'game-next-round', options: [players[1].nickname, players[1].avatar] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    /*
    it('should end a round if one player passes and the other player runs out of guesses', function() {
      let players = getPlayers(3);
      let nextClue = 'SILENCE OF THE LAMBS';
      //let firstClue = 'JURASSIC PARK';
      return playGame(players).then(function(game) {
        let promises = [
          { player: players[2], msg: pass },
        ];

        for ( let i=0;i<game.round.guesses-1;i++ ) {
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
      let players = getPlayers(3);
      let nextClue = 'SILENCE OF THE LAMBS';
      let lastPrompt = 'JURASSIC PARK';
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
            { to: players[0], key: 'round-over', options: [lastPrompt] },
            { to: players[1], key: 'round-over', options: [lastPrompt] },
            { to: players[2], key: 'round-over', options: [lastPrompt] },
            { to: players[0], key: 'game-next-round', options: [players[1].nickname, players[1].avatar] },
            { to: players[1], key: 'game-next-round-suggestion', options: [players[1].nickname, players[1].avatar, nextClue] },
            { to: players[2], key: 'game-next-round', options: [players[1].nickname, players[1].avatar] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should allow a game to move on if everyone passes', function() {
      let players = getPlayers(3);
      //let nextClue = 'SILENCE OF THE LAMBS';
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
            { to: players[0], key: 'emojis', options: [players[1].nickname, players[1].avatar, EMOJI] },
            { to: players[2], key: 'emojis', options: [players[1].nickname, players[1].avatar, EMOJI] },
            { to: players[0], key: 'guessing-instructions' },
            { to: players[2], key: 'guessing-instructions' }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should allow an initiator to pass', function() {
      let players = getPlayers(3);
      let nextClue = 'SILENCE OF THE LAMBS';
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
