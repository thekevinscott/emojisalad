'use strict';
/*
 * Tests that games work with two players
 *
 */

const Game = require('../../../models/game');
const getPlayers = require('../lib/getPlayers');
const startGame = require('../flows/startGame');
const playGame = require('../flows/playGame');
const setup = require('../lib/setup');
const check = require('../lib/check');
const signup = require('../flows/signup');
const getGame = require('../lib/getGame');
const setNonRandomGame = require('../lib/setNonRandomGame');
const rule = require('../../../config/rule');
const EMOJI = '😀';
const guess = rule('guess').example();

describe.only('Game', function() {

  it('should initiate the game with the person who started it', function() {
    const players = getPlayers(2);

    return signup(players[0]).then(function() {
      return setup([
        { player: players[0], msg: 'invite '+players[1].number},
        { player: players[1], msg: 'yes'},
        { player: players[1], msg: players[1].nickname },
      ]);
    }).then(function() {
      return setNonRandomGame(players[0]);
    }).then(function() {
      return check(
        { player: players[1], msg: players[1].avatar },
        [
          { key: 'accepted-invited', options: [players[1].nickname], to: players[0] },
          { key: 'accepted-inviter', options: [players[1].nickname, players[0].nickname], to: players[1] },
          { key: 'game-start', options: [players[0].nickname, 'JURASSIC PARK'], to: players[0] }
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should allow players to cross talk', function() {
    var players = getPlayers(3);

    return playGame(players).then(function() {
      var msg = 'huh?';
      return check(
        { player: players[1], msg: msg },
        [
          { to: players[0], key: 'says', options: [players[1].nickname, players[1].avatar, msg] },
          { to: players[2], key: 'says', options: [players[1].nickname, players[1].avatar, msg] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should allow the submitter to cross talk', function() {
    var players = getPlayers(3);

    return playGame(players).then(function() {
      var msg = 'just play';
      return check(
        { player: players[0], msg: msg },
        [
          { to: players[1], key: 'says', options: [players[0].nickname, players[0].avatar, msg] },
          { to: players[2], key: 'says', options: [players[0].nickname, players[0].avatar, msg] },
        ]
      ).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  describe('Player order', function() {
    it('should loop back to first player in the third round of a two person game', function() {
      var players = getPlayers(2);

      return playGame(players).then(function(game) {
        return setup([
          { player: players[1], msg: guess + game.round.phrase },
          { player: players[1], msg: EMOJI },
        ]);
      }).then(function() {
        // get a fresh version of the game, so we can get the phrase
        return getGame(players[0]);
      }).then(function(game) {
        var third_phrase = 'TIME AFTER TIME';
        return check(
          { player: players[0], msg: guess + game.round.phrase },
          [
            { to: players[1], key: 'says', options: [players[0].nickname, players[0].avatar, game.round.phrase] },
            { to: players[0], key: 'correct-guess', options: [players[0].nickname, players[0].avatar, game.round.phrase] },
            { to: players[1], key: 'correct-guess', options: [players[0].nickname, players[0].avatar, game.round.phrase] },
            { to: players[0], key: 'game-next-round-suggestion', options: [players[0].nickname, players[0].avatar, third_phrase] },
            { to: players[1], key: 'game-next-round', options: [players[0].nickname, players[0].avatar] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should loop back to first player in the fourth round of a three person game', function() {
      var players = getPlayers(3);

      return playGame(players).then(function(game) {
        return setup([
          { player: players[1], msg: guess+game.round.phrase },
          { player: players[1], msg: EMOJI },
          { player: players[0], msg: guess+' SILENCE OF THE LAMBS' },
          { player: players[2], msg: EMOJI },
        ]);
      }).then(function() {
        return getGame(players[0]);
      }).then(function(game) {
        let phrase = 'BUFFALO WILD WINGS';
        return check(
          { player: players[0], msg: guess + game.round.phrase},
          [
            { to: players[1], key: 'says', options: [players[0].nickname, players[0].avatar, game.round.phrase] },
            { to: players[2], key: 'says', options: [players[0].nickname, players[0].avatar, game.round.phrase] },
            { to: players[0], key: 'correct-guess', options: [players[0].nickname, players[0].avatar, game.round.phrase] },
            { to: players[1], key: 'correct-guess', options: [players[0].nickname, players[0].avatar, game.round.phrase] },
            { to: players[2], key: 'correct-guess', options: [players[0].nickname, players[0].avatar, game.round.phrase] },
            { to: players[0], key: 'game-next-round-suggestion', options: [players[0].nickname, players[0].avatar, phrase] },
            { to: players[1], key: 'game-next-round', options: [players[0].nickname, players[0].avatar, ] },
            { to: players[2], key: 'game-next-round', options: [players[0].nickname, players[0].avatar, ] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should add a third player at the second round and proceed to second player', function() {
      var players = getPlayers(3);

      return startGame(players.slice(0, 2)).then(function(game) {
        return setup([
          { player: players[0], msg: EMOJI },
          { player: players[0], msg: 'invite '+players[2].number },
          { player: players[2], msg: 'y' },
          { player: players[2], msg: players[2].nickname },
          { player: players[2], msg: players[2].avatar },
        ]);
      }).then(function() {
        return getGame(players[0]);
      }).then(function(game) {
        return check(
          { player: players[1], msg: guess + game.round.phrase },
          [
            { to: players[0], key: 'says', options: [players[1].nickname, players[1].avatar, game.round.phrase] },
            { to: players[2], key: 'says', options: [players[1].nickname, players[1].avatar, game.round.phrase] },
            { to: players[0], key: 'correct-guess', options: [players[1].nickname, players[1].avatar, game.round.phrase] },
            { to: players[1], key: 'correct-guess', options: [players[1].nickname, players[1].avatar, game.round.phrase] },
            { to: players[2], key: 'correct-guess', options: [players[1].nickname, players[1].avatar, game.round.phrase] },
            { to: players[0], key: 'join-game', options: [players[2].nickname, players[2].avatar ] },
            { to: players[1], key: 'join-game', options: [players[2].nickname, players[2].avatar ] },
            { to: players[2], key: 'join-game', options: [players[2].nickname, players[2].avatar ] },
            { to: players[0], key: 'game-next-round', options: [players[1].nickname, players[1].avatar] },
            { to: players[1], key: 'game-next-round-suggestion', options: [players[1].nickname, players[1].avatar, 'SILENCE OF THE LAMBS'] },
            { to: players[2], key: 'game-next-round', options: [players[1].nickname, players[1].avatar] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should add a third player at the third round and proceed to third player', function() {
      var players = getPlayers(3);

      return startGame(players.slice(0, 2)).then(function(game) {
        return setup([
          { player: players[0], msg: EMOJI },
          { player: players[1], msg: 'guess JURASSIC PARK' },
          { player: players[1], msg: EMOJI },
          { player: players[0], msg: 'invite '+players[2].number },
          { player: players[2], msg: 'y' },
          { player: players[2], msg: players[2].nickname },
          { player: players[2], msg: players[2].avatar },
        ]);
      }).then(function() {
        return getGame(players[0]);
      }).then(function(game) {
        return check(
          { player: players[0], msg: guess + game.round.phrase },
          [
            { to: players[1], key: 'says', options: [players[0].nickname, players[0].avatar, game.round.phrase] },
            { to: players[2], key: 'says', options: [players[0].nickname, players[0].avatar, game.round.phrase] },
            { to: players[0], key: 'correct-guess', options: [players[0].nickname, players[0].avatar, game.round.phrase] },
            { to: players[1], key: 'correct-guess', options: [players[0].nickname, players[0].avatar, game.round.phrase] },
            { to: players[2], key: 'correct-guess', options: [players[0].nickname, players[0].avatar, game.round.phrase] },
            { to: players[0], key: 'join-game', options: [players[2].nickname, players[2].avatar, ] },
            { to: players[1], key: 'join-game', options: [players[2].nickname, players[2].avatar, ] },
            { to: players[2], key: 'join-game', options: [players[2].nickname, players[2].avatar, ] },
            { to: players[0], key: 'game-next-round', options: [players[2].nickname, players[2].avatar ] },
            { to: players[1], key: 'game-next-round', options: [players[2].nickname, players[2].avatar ] },
            { to: players[2], key: 'game-next-round-suggestion', options: [players[2].nickname, players[2].avatar, 'TIME AFTER TIME'] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should add a fourth player at the fourth round and proceed to fourth player', function() {
      var players = getPlayers(4);
      return startGame(players.slice(0, 3)).then(function(game) {
        return setup([
          { player: players[0], msg: EMOJI },
          { player: players[1], msg: 'guess JURASSIC PARK' },
          { player: players[1], msg: EMOJI },
          { player: players[0], msg: 'guess SILENCE OF THE LAMBS' },
          { player: players[0], msg: 'invite '+players[3].number },
          { player: players[2], msg: EMOJI },
          { player: players[3], msg: 'y' },
          { player: players[3], msg: players[3].nickname },
          { player: players[3], msg: players[3].avatar },
        ]);
      }).then(function() {
        return getGame(players[0]);
      }).then(function(game) {
        return check(
          { player: players[0], msg: guess + game.round.phrase },
          [
            { to: players[1], key: 'says', options: [players[0].nickname, players[0].avatar, game.round.phrase] },
            { to: players[2], key: 'says', options: [players[0].nickname, players[0].avatar, game.round.phrase] },
            { to: players[3], key: 'says', options: [players[0].nickname, players[0].avatar, guess] },
            { to: players[0], key: 'correct-guess', options: [players[0].nickname, players[0].avatar, game.round.phrase] },
            { to: players[1], key: 'correct-guess', options: [players[0].nickname, players[0].avatar, game.round.phrase] },
            { to: players[2], key: 'correct-guess', options: [players[0].nickname, players[0].avatar, game.round.phrase] },
            { to: players[3], key: 'correct-guess', options: [players[0].nickname, players[0].avatar, game.round.phrase] },
            { to: players[0], key: 'join-game', options: [players[3].nickname, players[3].avatar ] },
            { to: players[1], key: 'join-game', options: [players[3].nickname, players[3].avatar ] },
            { to: players[2], key: 'join-game', options: [players[3].nickname, players[3].avatar ] },
            { to: players[3], key: 'join-game', options: [players[3].nickname, players[3].avatar ] },
            { to: players[0], key: 'game-next-round', options: [players[3].nickname, players[3].avatar, ] },
            { to: players[1], key: 'game-next-round', options: [players[3].nickname, players[3].avatar, ] },
            { to: players[2], key: 'game-next-round', options: [players[3].nickname, players[3].avatar, ] },
            { to: players[3], key: 'game-next-round-suggestion', options: [players[3].nickname, players[3].avatar, 'BUFFALO WILD WINGS'] },
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
  });
});
