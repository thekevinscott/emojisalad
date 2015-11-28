'use strict';
/*
 * Tests that guessing works
 *
 */

const Game = require('../../../models/game');
const getPlayers = require('../lib/getPlayers');
const playGame = require('../flows/playGame');
const setup = require('../lib/setup');
const check = require('../lib/check');
const getScore = require('../lib/getScore');
const rule = require('../../../config/rule');
const guess = rule('guess').example();
const rand = require('../lib/getRandomScore');
const EMOJI = '😀';

const defaults = {
  'win-guesser-1': rand(),
  'win-submitter-1': rand(),
  'win-guesser-2': rand(),
  'win-submitter-2': rand(),
  'pass': rand()
};

describe('Guessing', function() {

  it('should be able to successfully guess', function() {
    var players = getPlayers(3);
    var msg2 = 'SILENCE OF THE LAMBS';

    return playGame(players).then(function(game) {
      return Game.updateDefaultScores(game, defaults).then(function() {
        return game;
      });
    }).then(function(game) {
      let updates = {};
      updates[players[1].nickname] = defaults['win-guesser-1'];
      updates[players[0].nickname] = defaults['win-submitter-1'];
      let score = getScore(game, updates);
      return check(
        { player: players[1], msg: guess + game.round.phrase },
        [
          { key: 'guesses', options: [players[1].nickname, game.round.phrase], to: players[0] },
          { key: 'guesses', options: [players[1].nickname, game.round.phrase], to: players[2] },
          { key: 'correct-guess', options: [players[1].nickname, score], to: players[0] },
          { key: 'correct-guess', options: [players[1].nickname, score], to: players[1] },
          { key: 'correct-guess', options: [players[1].nickname, score], to: players[2] },
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
      return Game.updateDefaultScores(game, defaults).then(function() {
        return game;
      });
    }).then(function(game) {
      let updates = {};
      updates[players[1].nickname] = defaults['win-guesser-1'];
      updates[players[0].nickname] = defaults['win-submitter-1'];
      let score = getScore(game, updates);
      return check(
        { player: players[1], msg: guess + game.round.phrase.toLowerCase() },
        [
          { to: players[0],key: 'guesses', options: [players[1].nickname, game.round.phrase.toLowerCase()] },
          { to: players[2],key: 'guesses', options: [players[1].nickname, game.round.phrase.toLowerCase()] },
          { to: players[0], key: 'correct-guess', options: [players[1].nickname, score] },
          { to: players[1], key: 'correct-guess', options: [players[1].nickname, score] },
          { to: players[2], key: 'correct-guess', options: [players[1].nickname, score] },
          { to: players[0], key: 'game-next-round', options: [players[1].nickname] },
          { to: players[1], key: 'game-next-round-suggestion', options: [players[1].nickname, msg2] },
          { to: players[2], key: 'game-next-round', options: [players[1].nickname] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should be notified on an incorrect guess', function() {
    let players = getPlayers(3);

    return playGame(players).then(function() {
      let the_guess = 'foo';
      return check(
        { player: players[1], msg: guess + the_guess},
        [
          { to: players[0], key: 'guesses', options: [players[1].nickname, the_guess] },
          { to: players[2], key: 'guesses', options: [players[1].nickname, the_guess] },
          { to: players[0], key: 'incorrect-guess', options: [players[1].nickname] },
          { to: players[1], key: 'incorrect-guess', options: [players[1].nickname] },
          { to: players[2], key: 'incorrect-guess', options: [players[1].nickname] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should send a sad message when you run out of guesses', function() {
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
          { key: 'guesses', options: [players[1].nickname, the_guess.trim()], to: players[0] },
          { key: 'guesses', options: [players[1].nickname, the_guess.trim()], to: players[2] },
          { key: 'incorrect-out-of-guesses', to: players[0] },
          { key: 'incorrect-out-of-guesses', to: players[1] },
          { key: 'incorrect-out-of-guesses', to: players[2] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should chide you if you continue to guess after running out of guesses', function() {
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
          { key: 'guesses', options: [players[1].nickname, the_guess], to: players[0] },
          { key: 'guesses', options: [players[1].nickname, the_guess], to: players[2] },
          { key: 'out-of-guesses', options: [players[1].nickname], to: players[0] },
          { key: 'out-of-guesses', options: [players[1].nickname], to: players[1] },
          { key: 'out-of-guesses', options: [players[1].nickname], to: players[2] },
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
          { key: 'guesses', options: [players[1].nickname, the_guess], to: players[0] },
          { key: 'guesses', options: [players[1].nickname, the_guess], to: players[2] },
          { key: 'out-of-guesses', options: [players[1].nickname], to: players[0] },
          { key: 'out-of-guesses', options: [players[1].nickname], to: players[1] },
          { key: 'out-of-guesses', options: [players[1].nickname], to: players[2] },
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
          { to: players[0], key: 'guesses', options: [players[2].nickname, correct] },
          { to: players[1], key: 'guesses', options: [players[2].nickname, correct] },
          { to: players[0], key: 'correct-guess', options: [players[2].nickname, score] },
          { to: players[1], key: 'correct-guess', options: [players[2].nickname, score] },
          { to: players[2], key: 'correct-guess', options: [players[2].nickname, score] },
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
          { key: 'guesses', options: [players[2].nickname, the_guess], to: players[0] },
          { key: 'guesses', options: [players[2].nickname, the_guess], to: players[1] },
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

  //it.only('should handle the bug I saw in production', function() {
    //let players = getPlayers(3);

    //let msg2 = 'TIME AFTER TIME';

    //return playGame(players).then(function() {
      //return setup([
        //{ player: players[2], msg: guess + 'JURASSIC PARK' },
        //{ player: players[1], msg: EMOJI },
        //{ player: players[1], msg: EMOJI },
        //{ player: players[0], msg: guess + 'planet of the apes' },
        //{ player: players[0], msg: guess + 'space chimps' },
        //{ player: players[2], msg: clue },
        //{ player: players[2], msg: guess + '2001' },
      //]);
    //}).then(function() {
      //let the_guess = 'foo';
      //return check(
        //{ player: players[2], msg: guess + the_guess },
        //[
          //{ to: players[0], key: 'guesses', options: [players[2].nickname, the_guess] },
          //{ to: players[1], key: 'guesses', options: [players[2].nickname, the_guess] },
          //{ to: players[0], key: 'round-over', options: [players[2].nickname] },
          //{ to: players[1], key: 'round-over', options: [players[2].nickname] },
          //{ to: players[2], key: 'round-over', options: [players[2].nickname] },
          //{ to: players[0], key: 'game-next-round', options: [players[2].nickname] },
          //{ to: players[1], key: 'game-next-round', options: [players[2].nickname] },
          //{ to: players[2], key: 'game-next-round-suggestion', options: [players[2].nickname, msg2] },
        //]
      //).then(function(obj) {
        //obj.output.should.deep.equal(obj.expected);
      //});
    //});
  //});

});
