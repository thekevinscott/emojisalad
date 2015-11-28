'use strict';
/*
 * Tests that asking for help works
 *
 */

const Game = require('../../../models/game');
const Player = require('../../../models/player');
const getPlayers = require('../lib/getPlayers');
const startGame = require('../flows/startGame');
const playGame = require('../flows/playGame');
const invite = require('../flows/invite');
const check = require('../lib/check');
const setup = require('../lib/setup');
const rule = require('../../../config/rule');
const help = rule('help').example();
const guess = rule('guess').example();
let EMOJI = '😀';
let game_number = '12013409832';

describe('Help', function() {
  describe('Submitter', function() {
    it('should give help to a submitter before they submit their clue', function() {
      var players = getPlayers(3);

      return startGame(players).then(function(game) {
        return check(
          { player: game.round.submitter, msg: help },
          [
            { to: game.round.submitter, key: 'help-submitter-waiting-for-submission', },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should give help to a submitter after they submit their clue', function() {
      var players = getPlayers(3);

      return startGame(players).then(function(game) {
        return setup([
          { player: game.round.submitter, msg: EMOJI }
        ]).then(function() {
          return game;
        });
      }).then(function(game) {
        return check(
          { player: game.round.submitter, msg: help },
          [
            { to: game.round.submitter, key: 'help-submitter-submitted', },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
  });

  describe('Player', function() {
    it('should give help to a player while they\'re on the bench', function() {
      var players = getPlayers(3);

      return playGame(players.slice(0, 2)).then(function() {
        return invite(players[0], players[2]);
      }).then(function() {
        return check(
          { player: players[2], msg: help },
          [
            { to: players[2], key: 'help-player-bench' },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should give help to a player while they\'re waiting for a clue', function() {
      var players = getPlayers(3);

      return startGame(players).then(function(game) {
        return check(
          { player: players[2], msg: help },
          [
            { to: players[2], key: 'help-player-ready-for-game', options: [game.round.submitter.nickname] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should give help to a player during a game', function() {
      var players = getPlayers(3);

      return playGame(players).then(function() {
        return check(
          { player: players[2], msg: help },
          [
            { to: players[2], key: 'help-player-guessing' },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should give help to a player after a round', function() {
      var players = getPlayers(3);

      return playGame(players).then(function(game) {
        return setup([
          { player: players[1], msg: guess + game.round.phrase }
        ]).then(function() {
          return Player.get(players[0]).then(function(player) {
            return Game.get({ player: player, game_number: game_number });
          });
        });
      }).then(function(game) {
        return check(
          { player: players[2], msg: help },
          [
            { to: players[2], key: 'help-player-waiting-for-round', options: [game.round.submitter.nickname] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
  });
});
