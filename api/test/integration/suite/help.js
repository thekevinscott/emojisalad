'use strict';
/*
 * Tests that asking for help works
 *
 */

const Game = require('../../../models/game');
const User = require('../../../models/user');
const getUsers = require('../lib/getUsers');
const startGame = require('../flows/startGame');
const playGame = require('../flows/playGame');
const invite = require('../flows/invite');
const check = require('../lib/check');
const setup = require('../lib/setup');
const rule = require('../../../config/rule');
const help = rule('help').example();
const guess = rule('guess').example();
var submission = rule('submission').example();
var EMOJI = '😀';

describe('Help', function() {
  describe('Submitter', function() {
    it('should give help to a submitter before they submit their clue', function() {
      var users = getUsers(3);

      return startGame(users).then(function(game) {
        return check(
          { user: game.round.submitter, msg: help },
          [
            { to: game.round.submitter, key: 'help-submitter-waiting-for-submission', },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should give help to a submitter after they submit their clue', function() {
      var users = getUsers(3);

      return startGame(users).then(function(game) {
        return setup([
          { user: game.round.submitter, msg: submission + EMOJI }
        ]).then(function() {
          return game;
        });
      }).then(function(game) {
        return check(
          { user: game.round.submitter, msg: help },
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
      var users = getUsers(3);

      return playGame(users.slice(0, 2)).then(function() {
        return invite(users[0], users[2]);
      }).then(function() {
        return check(
          { user: users[2], msg: help },
          [
            { to: users[2], key: 'help-player-bench' },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should give help to a player while they\'re waiting for a clue', function() {
      var users = getUsers(3);

      return startGame(users).then(function(game) {
        return check(
          { user: users[2], msg: help },
          [
            { to: users[2], key: 'help-player-ready-for-game', options: [game.round.submitter.nickname] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should give help to a player during a game', function() {
      var users = getUsers(3);

      return playGame(users).then(function() {
        return check(
          { user: users[2], msg: help },
          [
            { to: users[2], key: 'help-player-guessing' },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should give help to a player after a round', function() {
      var users = getUsers(3);

      return playGame(users).then(function(game) {
        return setup([
          { user: users[1], msg: guess + game.round.phrase }
        ]).then(function() {
          return User.get(users[0]).then(function(user) {
            return Game.get({ user: user });
          });
        });
      }).then(function(game) {
        return check(
          { user: users[2], msg: help },
          [
            { to: users[2], key: 'help-player-waiting-for-round', options: [game.round.submitter.nickname] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
  });
});
