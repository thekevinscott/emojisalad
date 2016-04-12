'use strict';
/*
 * Tests that passing during a round works
 *
 */

/*
const Game = require('../../../models/game');
//const Player = require('../../../models/player');
const getPlayers = require('../lib/getPlayers');
//const startGame = require('../flows/startGame');
const playGame = require('../flows/playGame');
//const invite = require('../flows/invite');
//const check = require('../lib/check');
const setup = require('../lib/setup');
const rule = require('../../../config/rule');
//const clue = rule('clue').example();
const pass = rule('pass').example();
const EMOJI = '😀';
const guess = rule('guess').example();
const rand = require('../lib/getRandomScore');
const game_number = require('../../../../config/numbers').getDefault();

describe('Score', function() {
  it('should record a correct guess successfully', function() {
    var players = getPlayers(3);
    let defaults = {
      'win-guesser-1': rand(),
      'win-submitter-1': rand()
    };
    return playGame(players).then(function(game) {
      return Game.updateDefaultScores(game, defaults).then(function() {
        return setup([
          { player: players[1], msg: guess + 'JURASSIC PARK' },
        ]);
      }).then(function() {
        return Game.get({ player: game.players[0], game_number: game_number });
      }).then(function(game) {
        game.players[0].score.should.equal(defaults['win-submitter-1']);
        game.players[1].score.should.equal(defaults['win-guesser-1']);
        game.players[2].score.should.equal(0);
      });
    });
  });

  it('should record a pass successfully', function() {
    var players = getPlayers(3);
    let defaults = {
      'pass': rand(),
    };
    return playGame(players).then(function(game) {
      return Game.updateDefaultScores(game, defaults).then(function() {
        return setup([
          { player: players[1], msg: pass },
        ]);
      }).then(function() {
        return Game.get({ player: game.players[0], game_number: game_number });
      }).then(function(game) {
        game.players[0].score.should.equal(0);
        game.players[1].score.should.equal(defaults.pass);
        game.players[2].score.should.equal(0);
      });
    });
  });

  it('should record a correct guess successfully after a wrong guess', function() {
    var players = getPlayers(3);
    let defaults = {
      'win-guesser-2': rand(),
      'win-submitter-2': rand()
    };
    return playGame(players).then(function(game) {
      return Game.updateDefaultScores(game, defaults).then(function() {
        return setup([
          { player: players[1], msg: guess + 'foo' },
          { player: players[1], msg: guess + 'JURASSIC PARK' },
        ]);
      }).then(function() {
        return Game.get({ player: game.players[0], game_number: game_number });
      }).then(function(game) {
        game.players[0].score.should.equal(defaults['win-submitter-2']);
        game.players[1].score.should.equal(defaults['win-guesser-2']);
        game.players[2].score.should.equal(0);
      });
    });
  });

  it('should sum up points over time from winning', function() {
    var players = getPlayers(3);
    let defaults = {
      'win-guesser-1': rand(),
      'win-submitter-1': rand()
    };
    return playGame(players).then(function(game) {
      return Game.updateDefaultScores(game, defaults).then(function() {
        return setup([
          { player: players[2], msg: guess + 'JURASSIC PARK' },
          { player: players[1], msg: EMOJI },
          { player: players[2], msg: guess + 'SILENCE OF THE LAMBS' },
        ]);
      }).then(function() {
        return Game.get({ player: game.players[0], game_number: game_number });
      }).then(function(game) {
        game.players[0].score.should.equal(defaults['win-submitter-1']);
        game.players[1].score.should.equal(defaults['win-submitter-1']);
        game.players[2].score.should.equal(defaults['win-guesser-1']*2);
      });
    });
  });

  it('should sum up points over time from passing', function() {
    var players = getPlayers(3);
    let defaults = {
      'win-guesser-1': rand(),
      'win-submitter-1': rand(),
      'pass': rand() 
    };
    return playGame(players).then(function(game) {
      return Game.updateDefaultScores(game, defaults).then(function() {
        return setup([
          { player: players[2], msg: pass },
          { player: players[1], msg: guess + 'JURASSIC PARK' },
          { player: players[1], msg: EMOJI },
          { player: players[2], msg: pass },
        ]);
      }).then(function() {
        return Game.get({ player: game.players[0], game_number: game_number });
      }).then(function(game) {
        game.players[0].score.should.equal(defaults['win-submitter-1']);
        game.players[1].score.should.equal(defaults['win-guesser-1']);
        game.players[2].score.should.equal(defaults.pass*2);
      });
    });
  });
});
*/
