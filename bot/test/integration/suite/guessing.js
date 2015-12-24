'use strict';
/*
 * Tests that guessing works
 *
 */

const Game = require('../../../models/game');
const Player = require('../../../models/player');
const getPlayers = require('../lib/getPlayers');
const playGame = require('../flows/playGame');
const setup = require('../lib/setup');
const check = require('../lib/check');
const rule = require('../../../config/rule');
const guess = rule('guess').example();
const EMOJI = '😀';

describe('Guessing', function() {

  describe('Correct', function() {
    it.only('should be able to successfully guess', function() {
      var players = getPlayers(3);
      var msg2 = 'SILENCE OF THE LAMBS';

      return playGame(players).then(function(game) {
        return check(
          { player: players[1], msg: guess + game.round.phrase },
          [
            { key: 'says', options: [players[1].nickname, players[1].avatar, game.round.phrase], to: players[0] },
            { key: 'says', options: [players[1].nickname, players[1].avatar, game.round.phrase], to: players[2] },
            { key: 'correct-guess', options: [players[1].nickname, game.round.phrase], to: players[0] },
            { key: 'correct-guess', options: [players[1].nickname, game.round.phrase], to: players[1] },
            { key: 'correct-guess', options: [players[1].nickname, game.round.phrase], to: players[2] },
            { key: 'game-next-round', options: [players[1].nickname], to: players[0] },
            { key: 'game-next-round-suggestion', options: [players[1].nickname, msg2], to: players[1] },
            { key: 'game-next-round', options: [players[1].nickname], to: players[2] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });

    });

    it('should be able to successfully guess with case insensitivity', function() {
      const players = getPlayers(3);
      const msg2 = 'SILENCE OF THE LAMBS';

      return playGame(players).then(function(game) {
        return check(
          { player: players[1], msg: guess + game.round.phrase.toLowerCase() },
          [
            { to: players[0],key: 'says', options: [players[1].nickname, players[1].avatar, game.round.phrase.toLowerCase()] },
            { to: players[2],key: 'says', options: [players[1].nickname, players[1].avatar, game.round.phrase.toLowerCase()] },
            { to: players[0], key: 'correct-guess', options: [players[1].nickname, game.round.phrase] },
            { to: players[1], key: 'correct-guess', options: [players[1].nickname, game.round.phrase] },
            { to: players[2], key: 'correct-guess', options: [players[1].nickname, game.round.phrase] },
            { to: players[0], key: 'game-next-round', options: [players[1].nickname] },
            { to: players[1], key: 'game-next-round-suggestion', options: [players[1].nickname, msg2] },
            { to: players[2], key: 'game-next-round', options: [players[1].nickname] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should be able to successfully guess with the maximum number of typos', function() {
      const players = getPlayers(3);
      const msg2 = 'SILENCE OF THE LAMBS';

      return playGame(players).then(function(game) {
        let the_guess = 'JURASIC PARK';
        return check(
          { player: players[1], msg: guess + the_guess },
          [
            { to: players[0],key: 'says', options: [players[1].nickname, players[1].avatar, the_guess] },
            { to: players[2],key: 'says', options: [players[1].nickname, players[1].avatar, the_guess] },
            { to: players[0], key: 'correct-guess', options: [players[1].nickname, game.round.phrase] },
            { to: players[1], key: 'correct-guess', options: [players[1].nickname, game.round.phrase] },
            { to: players[2], key: 'correct-guess', options: [players[1].nickname, game.round.phrase] },
            { to: players[0], key: 'game-next-round', options: [players[1].nickname] },
            { to: players[1], key: 'game-next-round-suggestion', options: [players[1].nickname, msg2] },
            { to: players[2], key: 'game-next-round', options: [players[1].nickname] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should be able to successfully guess with the a similar enough guess through google', function() {
      const players = getPlayers(3);
      const msg3 = 'TIME AFTER TIME';

      return playGame(players).then(function(game) {
        return setup([
          { player: players[2], msg: guess + game.round.phrase },
        ]).then(function() {
          return Player.get(players[2]).then(function(player) {
            return Game.get({ player: player });
          });
        });
      }).then(function(game) {
        let the_guess = 'SILENCE OF THE';
        return check(
          { player: players[2], msg: guess + the_guess },
          [
            { to: players[0],key: 'says', options: [players[2].nickname, players[2].avatar, the_guess] },
            { to: players[1],key: 'says', options: [players[2].nickname, players[2].avatar, the_guess] },
            { to: players[0], key: 'correct-guess', options: [players[2].nickname, game.round.phrase] },
            { to: players[1], key: 'correct-guess', options: [players[2].nickname, game.round.phrase] },
            { to: players[2], key: 'correct-guess', options: [players[2].nickname, game.round.phrase] },
            { to: players[0], key: 'game-next-round', options: [players[2].nickname] },
            { to: players[1], key: 'game-next-round', options: [players[2].nickname] },
            { to: players[2], key: 'game-next-round-suggestion', options: [players[2].nickname, msg3] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should be able to guess without articles', function() {
      const players = getPlayers(3);
      const msg2 = 'SILENCE OF THE LAMBS';
      const msg3 = 'TIME AFTER TIME';

      return playGame(players).then(function(game) {
        return setup([
          { player: players[2], msg: guess + game.round.phrase },
        ]).then(function() {
          return Player.get(players[1]).then(function(player) {
            return Game.get({ player: player });
          });
        });
      }).then(function(game) {
        let the_guess = 'SILENCE LAMBS';
        return check(
          { player: players[2], msg: guess + the_guess},
          [
            { to: players[0],key: 'says', options: [players[2].nickname, players[2].avatar, the_guess] },
            { to: players[1],key: 'says', options: [players[2].nickname, players[2].avatar, the_guess] },
            { to: players[0], key: 'correct-guess', options: [players[2].nickname, game.round.phrase] },
            { to: players[1], key: 'correct-guess', options: [players[2].nickname, game.round.phrase] },
            { to: players[2], key: 'correct-guess', options: [players[2].nickname, game.round.phrase] },
            { to: players[0], key: 'game-next-round', options: [players[2].nickname] },
            { to: players[1], key: 'game-next-round', options: [players[2].nickname] },
            { to: players[2], key: 'game-next-round-suggestion', options: [players[2].nickname, msg3] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should be able to guess without considering punctuation', function() {
      const players = getPlayers(3);
      const msg2 = 'SILENCE OF THE LAMBS';

      return playGame(players).then(function(game) {
        let the_guess = 'JURASSIC !@#$%^&*()-=_+~`,./?><\'";:[]{}|\ PARK';
        return check(
          { player: players[2], msg: guess + the_guess},
          [
            { to: players[0],key: 'says', options: [players[2].nickname, players[2].avatar, the_guess] },
            { to: players[1],key: 'says', options: [players[2].nickname, players[2].avatar, the_guess] },
            { to: players[0], key: 'correct-guess', options: [players[2].nickname, game.round.phrase] },
            { to: players[1], key: 'correct-guess', options: [players[2].nickname, game.round.phrase] },
            { to: players[2], key: 'correct-guess', options: [players[2].nickname, game.round.phrase] },
            { to: players[0], key: 'game-next-round', options: [players[1].nickname] },
            { to: players[1], key: 'game-next-round-suggestion', options: [players[1].nickname, msg2] },
            { to: players[2], key: 'game-next-round', options: [players[1].nickname] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
  });

  describe('Incorrect', function() {
    it('should not be notified on an incorrect guess', function() {
      let players = getPlayers(3);

      return playGame(players).then(function() {
        let the_guess = 'foo';
        return check(
          { player: players[1], msg: guess + the_guess},
          [
            { to: players[0], key: 'says', options: [players[1].nickname, players[1].avatar, the_guess] },
            { to: players[2], key: 'says', options: [players[1].nickname, players[1].avatar, the_guess] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should let people guess as many times as they want', function() {
      let players = getPlayers(3);

      let the_guess = 'foo';
      return playGame(players).then(function() {
        return setup([
          { player: players[1], msg: guess + the_guess},
          { player: players[1], msg: guess + the_guess},
          { player: players[1], msg: guess + the_guess},
        ]);
      }).then(function() {
        return check(
          { player: players[1], msg: guess + the_guess},
          [
            { to: players[0], key: 'says', options: [players[1].nickname, players[1].avatar, the_guess] },
            { to: players[2], key: 'says', options: [players[1].nickname, players[1].avatar, the_guess] },
            { to: players[0], key: 'incorrect-guess', options: [players[1].nickname] },
            { to: players[1], key: 'incorrect-guess', options: [players[1].nickname] },
            { to: players[2], key: 'incorrect-guess', options: [players[1].nickname] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
  });

  /*
  it('should send a sad message when you run out of says', function() {
    let players = getPlayers(3);

    let the_guess = ' foo';
    return playGame(players).then(function() {
      return setup([
        { player: players[1], msg: guess + the_guess }
      ]);
    }).then(function() {
      return check(
        { player: players[1], msg: guess + the_guess },
        [
          { key: 'says', options: [players[1].nickname, the_guess.trim()], to: players[0] },
          { key: 'says', options: [players[1].nickname, the_guess.trim()], to: players[2] },
          { key: 'incorrect-out-of-says', to: players[0] },
          { key: 'incorrect-out-of-says', to: players[1] },
          { key: 'incorrect-out-of-says', to: players[2] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should chide you if you continue to guess after running out of says', function() {
    let players = getPlayers(3);

    let the_guess = 'foo';
    return playGame(players).then(function() {
      return setup([
        { player: players[1], msg: guess + the_guess },
        { player: players[1], msg: guess + the_guess },
      ]);
    }).then(function() {
      return check(
        { player: players[1], msg: guess + the_guess },
        [
          { key: 'says', options: [players[1].nickname, the_guess], to: players[0] },
          { key: 'says', options: [players[1].nickname, the_guess], to: players[2] },
          { key: 'out-of-says', options: [players[1].nickname], to: players[0] },
          { key: 'out-of-says', options: [players[1].nickname], to: players[1] },
          { key: 'out-of-says', options: [players[1].nickname], to: players[2] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should allow one player to guess, the other player to guess, and then catch the first player guessing a second time and boot them', function() {
    let players = getPlayers(3);

    let the_guess = 'foo';
    return playGame(players).then(function() {
      return setup([
        { player: players[1], msg: guess + the_guess },
        { player: players[2], msg: guess + the_guess },
        { player: players[1], msg: guess + the_guess },
      ]);
    }).then(function() {
      return check(
        { player: players[1], msg: guess + the_guess },
        [
          { key: 'says', options: [players[1].nickname, the_guess], to: players[0] },
          { key: 'says', options: [players[1].nickname, the_guess], to: players[2] },
          { key: 'out-of-says', options: [players[1].nickname], to: players[0] },
          { key: 'out-of-says', options: [players[1].nickname], to: players[1] },
          { key: 'out-of-says', options: [players[1].nickname], to: players[2] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should allow a player to fail miserably and the other one can still win', function() {
    let players = getPlayers(3);

    let the_guess = 'foo';
    let msg2 = 'SILENCE OF THE LAMBS';

    return playGame(players).then(function(game) {
      return setup([
        { player: players[1], msg: guess + the_guess },
        { player: players[2], msg: guess + the_guess },
        { player: players[1], msg: guess + the_guess },
      ]).then(function() {
        return Game.updateDefaultScores(game, defaults).then(function() {
          return game;
        });
      });
    }).then(function(game) {
      let updates = {};
      updates[players[2].nickname] = defaults['win-guesser-1'];
      updates[players[0].nickname] = defaults['win-submitter-1'];
      let score = getScore(game, updates);
      let correct = 'jurassic park';
      return check(
        { player: players[2], msg: guess + correct },
        [
          { to: players[0], key: 'says', options: [players[2].nickname, correct] },
          { to: players[1], key: 'says', options: [players[2].nickname, correct] },
          { to: players[0], key: 'correct-guess', options: [players[2].nickname, game.round.phrase, score] },
          { to: players[1], key: 'correct-guess', options: [players[2].nickname, game.round.phrase, score] },
          { to: players[2], key: 'correct-guess', options: [players[2].nickname, game.round.phrase, score] },
          { to: players[0], key: 'game-next-round', options: [players[1].nickname] },
          { to: players[1], key: 'game-next-round-suggestion', options: [players[1].nickname, msg2] },
          { to: players[2], key: 'game-next-round', options: [players[1].nickname] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should really get sad if everyone fails and then start a new round', function() {
    let players = getPlayers(3);

    let the_guess = 'foo';
    let msg2 = 'SILENCE OF THE LAMBS';

    return playGame(players).then(function() {
      return setup([
        { player: players[1], msg: guess + the_guess },
        { player: players[2], msg: guess + the_guess },
        { player: players[1], msg: guess + the_guess },
      ]);
    }).then(function() {
      return check(
        { player: players[2], msg: guess + the_guess },
        [
          { key: 'says', options: [players[2].nickname, the_guess], to: players[0] },
          { key: 'says', options: [players[2].nickname, the_guess], to: players[1] },
          { key: 'round-over', options: [players[2].nickname], to: players[0] },
          { key: 'round-over', options: [players[2].nickname], to: players[1] },
          { key: 'round-over', options: [players[2].nickname], to: players[2] },
          { key: 'game-next-round', options: [players[1].nickname], to: players[0] },
          { key: 'game-next-round-suggestion', options: [players[1].nickname, msg2], to: players[1] },
          { key: 'game-next-round', options: [players[1].nickname], to: players[2] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should allow a game to move on if everyone loses', function() {
    let players = getPlayers(3);

    let the_guess = 'foo';
    //let msg2 = 'SILENCE OF THE LAMBS';

    return playGame(players).then(function() {
      return setup([
        { player: players[1], msg: guess + the_guess },
        { player: players[2], msg: guess + the_guess },
        { player: players[2], msg: guess + the_guess },
        { player: players[1], msg: guess + the_guess },
      ]);
    }).then(function() {
      return check(
        { player: players[1], msg: EMOJI },
        [
          { to: players[1], key: 'game-submission-sent'},
          { to: players[0], key: 'says', options: [players[1].nickname, players[1].avatar, EMOJI] },
          { to: players[2], key: 'says', options: [players[1].nickname, players[1].avatar, EMOJI] },
          { to: players[0], key: 'guessing-instructions' },
          { to: players[2], key: 'guessing-instructions' }
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });
  */
});
