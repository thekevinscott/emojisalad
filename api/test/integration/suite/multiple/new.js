'use strict';
const getPlayers = require('test/integration/lib/getPlayers');
const playGame = require('test/integration/flows/playGame');
const check = require('test/integration/lib/check');
const setup = require('test/integration/lib/setup');
const rule = require('config/rule');
const Player = require('models/player');

const game_numbers = require('../../../../../config/numbers');

describe('New Game', function() {
  describe('Legal', function() {
    it('should initiate a new game from a second phone number and prompt for invites', function() {
      let players = getPlayers(3);
      return playGame(players).then(function() {
        return check(
          { player: players[0], msg: rule('new-game').example() },
          [
            { key: 'new-game', options: [players[0].nickname], to: players[0], from: game_numbers[1] },
          ]
        );
      }).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    describe('Inviting', function() {
      it('should send out an invite to a brand new player from the first game number with a regular onboarding process', function() {
        let players = getPlayers(3);
        let new_player = getPlayers(1)[0];
        return playGame(players).then(function() {
          return setup([
            { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
          ]);
        }).then(function() {
          return check(
            { player: players[0], msg: rule('invite').example() + new_player.number, to: game_numbers[1] },
            [
              { key: 'intro_4', options: [new_player.number], to: players[0], from: game_numbers[1] },
              { key: 'invite', options: [players[0].nickname], to: new_player, from: game_numbers[0]  }
            ]
          );
        }).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });

      it('should send out an invite to an existing player in one game from the second game number with an abridged onboarding process', function() {
        let players = getPlayers(3);
        let existing_player = players[1];
        return playGame(players).then(function() {
          return setup([
            { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
          ]);
        }).then(function() {
          console.log('money shot here');
          return check(
            { player: players[0], msg: rule('invite').example() + existing_player.number, to: game_numbers[1] },
            [
              { key: 'intro_existing_player', options: [existing_player.number], to: players[0], from: game_numbers[1] },
              { key: 'invite_existing_player', options: [existing_player.nickname, players[0].nickname], to: existing_player, from: game_numbers[1]  }
            ]
          );
        }).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });
  });

  describe('Illegal', function() {
    it('should disallow a player from starting a new game if already playing the maximum number of games', function() {
      let players = getPlayers(3);
      return playGame(players).then(function() {
        return Player.get(players[0]).then(function(player) {
          return Player.update(player, { maximum_games: 2 });
        });
      }).then(function() {
        return setup([
          { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
        ]);
      }).then(function() {
        return check(
          { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
          [
            { key: 'error-maximum-games', to: players[0], from: game_numbers[0] },
          ]
        );
      }).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should disallow a player from inviting a player currently playing the maximum number of games', function() {
      let players = getPlayers(3);
      return playGame(players).then(function() {
        return Player.get(players[2]).then(function(player) {
          return Player.update(player, { maximum_games: 2 });
        });
      }).then(function() {
        return setup([
          { player: players[2], msg: rule('new-game').example(), to: game_numbers[0] },
          { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
        ]);
      }).then(function() {
        return check(
          { player: players[0], msg: rule('invite').example() + players[2].number, to: game_numbers[1] },
          [
            { key: 'error-12', to: players[0], from: game_numbers[1] },
          ]
        );
      }).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should disallow a player from starting a new game if they have not finished onboarding', function() {
      var player = getPlayers(1)[0];
      return setup([
        { player: player, msg: 'hello' },
        { player: player, msg: 'y' },
      ]).then(function() {
        return check(
          { player: player, msg: rule('new-game').example() },
          [
            { key: 'error-13', to: player }
          ]
        ).then(function(obj) {
          obj.output.should.deep.equal(obj.expected);
        });
      });
    });

    it('should disallow a player from inviting a new player multiple times', function() {
      let players = getPlayers(3);
      let new_player = getPlayers(1)[0];
      return playGame(players).then(function() {
        return setup([
          { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
          { player: players[0], msg: rule('invite').example() + new_player.number, to: game_numbers[1] },
        ]);
      }).then(function() {
        return check(
          { player: players[0], msg: rule('invite').example() + new_player.number, to: game_numbers[1] },
          [
            { key: 'error-2', options: [new_player.number], to: players[0], from: game_numbers[1] },
          ]
        );
      }).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });

    it('should disallow a player from inviting an existing player multiple times', function() {
      let players = getPlayers(3);
      let existing_player = players[1];
      return playGame(players).then(function() {
        return setup([
          { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
          { player: players[0], msg: rule('invite').example() + existing_player.number, to: game_numbers[1] },
        ]);
      }).then(function() {
        return check(
          { player: players[0], msg: rule('invite').example() + existing_player.number, to: game_numbers[1] },
          [
            { key: 'error-2', options: [players[1].number], to: players[0], from: game_numbers[1] },
          ]
        );
      }).then(function(obj) {
        obj.output.should.deep.equal(obj.expected);
      });
    });
  });

  it('should be able to receive a text from a new game number and not create another user but create another player and another game', function() {
    throw 'fix';
  });
});
