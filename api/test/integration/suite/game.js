'use strict';
/*
 * Tests that games work with two players
 *
 */

const Game = require('../../../models/game');
const getUsers = require('../lib/getUsers');
const startGame = require('../flows/startGame');
const playGame = require('../flows/playGame');
const setup = require('../lib/setup');
const check = require('../lib/check');
const signup = require('../flows/signup');
const getScore = require('../lib/getScore');
const getGame = require('../lib/getGame');
const setNonRandomGame = require('../lib/setNonRandomGame');
const rule = require('../../../config/rule');
const EMOJI = '😀';
const submission = rule('submission').example();
const guess = rule('guess').example();
const rand = require('../lib/getRandomScore');

const defaults = {
  'win-guesser-1': rand(),
  'win-submitter-1': rand(),
  'win-guesser-2': rand(),
  'win-submitter-2': rand(),
  'pass': rand()
};

describe('Game', function() {

  it.only('should initiate the game with the person who started it', function() {
    const users = getUsers(2);

    return signup(users[0]).then(function() {
      return setup([
        {user: users[0], msg: 'invite '+users[1].number},
        {user: users[1], msg: 'yes'},
      ]);
    }).then(function() {
      return setNonRandomGame(users[0]);
    }).then(function() {
      return check(
        {user: users[1], msg: users[1].nickname},
        [
          { key: 'accepted-invited', options: [users[1].nickname], to: users[0] },
          { key: 'accepted-inviter', options: [users[1].nickname, users[0].nickname], to: users[1] },
          { key: 'game-start', options: [users[0].nickname, 'JURASSIC PARK'], to: users[0] }
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should allow players to cross talk', function() {
    var users = getUsers(3);

    return playGame(users).then(function() {
      var msg = 'huh?';
      return check(
        { user: users[1], msg: msg },
        [
          { to: users[0], key: 'says', options: [users[1].nickname, msg] },
          { to: users[2], key: 'says', options: [users[1].nickname, msg] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should allow the submitter to cross talk', function() {
    var users = getUsers(3);

    return playGame(users).then(function() {
      var msg = 'just play';
      return check(
        { user: users[0], msg: msg },
        [
          { to: users[1], key: 'says', options: [users[0].nickname, msg] },
          { to: users[2], key: 'says', options: [users[0].nickname, msg] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  describe('Player order', function() {
    it('should loop back to first player in the third round of a two person game', function() {
      var users = getUsers(2);

      return playGame(users).then(function(game) {
        return Game.updateDefaultScores(game, defaults).then(function() {
          return setup([
            { user: users[1], msg: guess + game.round.phrase },
            { user: users[1], msg: submission + EMOJI },
          ]);
        });
      }).then(function() {
        // get a fresh version of the game, so we can get the phrase
        return getGame(users[0]);
      }).then(function(game) {
        let updates = {};
        updates[users[0].nickname] = defaults['win-guesser-1'];
        updates[users[1].nickname] = defaults['win-submitter-1'];
        let score = getScore(game, updates);
        var third_phrase = 'TIME AFTER TIME';
        return check(
          { user: users[0], msg: guess + game.round.phrase },
          [
            { to: users[1], key: 'guesses', options: [users[0].nickname, game.round.phrase] },
            { to: users[0], key: 'correct-guess', options: [users[0].nickname, score] },
            { to: users[1], key: 'correct-guess', options: [users[0].nickname, score] },
            { to: users[0], key: 'game-next-round-suggestion', options: [users[0].nickname, third_phrase] },
            { to: users[1], key: 'game-next-round', options: [users[0].nickname] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should loop back to first player in the fourth round of a three person game', function() {
      var users = getUsers(3);

      return playGame(users).then(function(game) {
        return Game.updateDefaultScores(game, defaults).then(function() {
          return setup([
            { user: users[1], msg: guess+game.round.phrase },
            { user: users[1], msg: submission + EMOJI },
            { user: users[0], msg: guess+' SILENCE OF THE LAMBS' },
            { user: users[2], msg: submission + EMOJI },
          ]);
        });
      }).then(function() {
        return getGame(users[0]);
      }).then(function(game) {
        let phrase = 'BUFFALO WILD WINGS';
        let updates = {};
        updates[users[0].nickname] = defaults['win-guesser-1'];
        updates[users[2].nickname] = defaults['win-submitter-1'];
        let score = getScore(game, updates);
        return check(
          { user: users[0], msg: guess + game.round.phrase},
          [
            { to: users[1], key: 'guesses', options: [users[0].nickname, game.round.phrase] },
            { to: users[2], key: 'guesses', options: [users[0].nickname, game.round.phrase] },
            { to: users[0], key: 'correct-guess', options: [users[0].nickname, score] },
            { to: users[1], key: 'correct-guess', options: [users[0].nickname, score] },
            { to: users[2], key: 'correct-guess', options: [users[0].nickname, score] },
            { to: users[0], key: 'game-next-round-suggestion', options: [users[0].nickname, phrase] },
            { to: users[1], key: 'game-next-round', options: [users[0].nickname] },
            { to: users[2], key: 'game-next-round', options: [users[0].nickname] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should add a third player at the second round and proceed to second user', function() {
      var users = getUsers(3);

      return startGame(users.slice(0, 2)).then(function(game) {
        return Game.updateDefaultScores(game, defaults).then(function() {
          return setup([
            { user: users[0], msg: submission + EMOJI },
            { user: users[0], msg: 'invite '+users[2].number },
            { user: users[2], msg: 'y' },
            { user: users[2], msg: users[2].nickname },
          ]);
        });
      }).then(function() {
        return getGame(users[0]);
      }).then(function(game) {
        let updates = {};
        updates[users[1].nickname] = defaults['win-guesser-1'];
        updates[users[0].nickname] = defaults['win-submitter-1'];
        let score = getScore(game, updates);
        return check(
          { user: users[1], msg: guess + game.round.phrase },
          [
            { to: users[0], key: 'guesses', options: [users[1].nickname, game.round.phrase] },
            { to: users[2], key: 'guesses', options: [users[1].nickname, game.round.phrase] },
            { to: users[0], key: 'correct-guess', options: [users[1].nickname, score] },
            { to: users[1], key: 'correct-guess', options: [users[1].nickname, score] },
            { to: users[2], key: 'correct-guess', options: [users[1].nickname, score] },
            { to: users[0], key: 'join-game', options: [users[2].nickname] },
            { to: users[1], key: 'join-game', options: [users[2].nickname] },
            { to: users[2], key: 'join-game', options: [users[2].nickname] },
            { to: users[0], key: 'game-next-round', options: [users[1].nickname] },
            { to: users[1], key: 'game-next-round-suggestion', options: [users[1].nickname, 'SILENCE OF THE LAMBS'] },
            { to: users[2], key: 'game-next-round', options: [users[1].nickname] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should add a third player at the third round and proceed to third user', function() {
      var users = getUsers(3);

      return startGame(users.slice(0, 2)).then(function(game) {
        return Game.updateDefaultScores(game, defaults).then(function() {
          return setup([
            { user: users[0], msg: submission + EMOJI },
            { user: users[1], msg: 'guess JURASSIC PARK' },
            { user: users[1], msg: submission + EMOJI },
            { user: users[0], msg: 'invite '+users[2].number },
            { user: users[2], msg: 'y' },
            { user: users[2], msg: users[2].nickname },
          ]);
        });
      }).then(function() {
        return getGame(users[0]);
      }).then(function(game) {
        let updates = {};
        updates[users[0].nickname] = defaults['win-guesser-1'];
        updates[users[1].nickname] = defaults['win-submitter-1'];
        let score = getScore(game, updates);
        return check(
          { user: users[0], msg: guess + game.round.phrase },
          [
            { to: users[1], key: 'guesses', options: [users[0].nickname, game.round.phrase] },
            { to: users[2], key: 'guesses', options: [users[0].nickname, game.round.phrase] },
            { to: users[0], key: 'correct-guess', options: [users[0].nickname, score] },
            { to: users[1], key: 'correct-guess', options: [users[0].nickname, score] },
            { to: users[2], key: 'correct-guess', options: [users[0].nickname, score] },
            { to: users[0], key: 'join-game', options: [users[2].nickname] },
            { to: users[1], key: 'join-game', options: [users[2].nickname] },
            { to: users[2], key: 'join-game', options: [users[2].nickname] },
            { to: users[0], key: 'game-next-round', options: [users[2].nickname] },
            { to: users[1], key: 'game-next-round', options: [users[2].nickname] },
            { to: users[2], key: 'game-next-round-suggestion', options: [users[2].nickname, 'TIME AFTER TIME'] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should add a fourth player at the fourth round and proceed to fourth user', function() {
      var users = getUsers(4);

      return startGame(users.slice(0, 3)).then(function(game) {
        return Game.updateDefaultScores(game, defaults).then(function() {
          return setup([
            { user: users[0], msg: submission + EMOJI },
            { user: users[1], msg: 'guess JURASSIC PARK' },
            { user: users[1], msg: submission + EMOJI },
            { user: users[0], msg: 'guess SILENCE OF THE LAMBS' },
            { user: users[0], msg: 'invite '+users[3].number },
            { user: users[2], msg: submission + EMOJI },
            { user: users[3], msg: 'y' },
            { user: users[3], msg: users[3].nickname },
          ]);
        });
      }).then(function() {
        return getGame(users[0]);
      }).then(function(game) {
        let updates = {};
        updates[users[0].nickname] = defaults['win-guesser-1'];
        updates[users[2].nickname] = defaults['win-submitter-1'];
        let score = getScore(game, updates);

        return check(
          { user: users[0], msg: guess + game.round.phrase },
          [
            { to: users[1], key: 'guesses', options: [users[0].nickname, game.round.phrase] },
            { to: users[2], key: 'guesses', options: [users[0].nickname, game.round.phrase] },
            { to: users[3], key: 'guesses', options: [users[0].nickname, guess] },
            { to: users[0], key: 'correct-guess', options: [users[0].nickname, score] },
            { to: users[1], key: 'correct-guess', options: [users[0].nickname, score] },
            { to: users[2], key: 'correct-guess', options: [users[0].nickname, score] },
            { to: users[3], key: 'correct-guess', options: [users[0].nickname, score] },
            { to: users[0], key: 'join-game', options: [users[3].nickname] },
            { to: users[1], key: 'join-game', options: [users[3].nickname] },
            { to: users[2], key: 'join-game', options: [users[3].nickname] },
            { to: users[3], key: 'join-game', options: [users[3].nickname] },
            { to: users[0], key: 'game-next-round', options: [users[3].nickname] },
            { to: users[1], key: 'game-next-round', options: [users[3].nickname] },
            { to: users[2], key: 'game-next-round', options: [users[3].nickname] },
            { to: users[3], key: 'game-next-round-suggestion', options: [users[3].nickname, 'BUFFALO WILD WINGS'] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
  });
});
