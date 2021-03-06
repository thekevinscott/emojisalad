'use strict';
const getPlayers = require('lib/getPlayers');
const playGame = require('flows/playGame');
//const startGame = require('flows/startGame');
//const signup = require('flows/signup');
const setup = require('lib/setup');
//const getPhrase = require('lib/getPhrase');
const check = require('lib/check');
const rule = require('../../../config/rule');
//const guess = rule('guess').example();
const EMOJI = '😀';

const game_numbers = require('../../../../testqueue/config/numbers');

describe('New Game', () => {
  describe('Legal', () => {
    it('should initiate a new game from a second phone number and prompt for invites', () => {
      const players = getPlayers(3);
      return playGame(players).then(() => {
        const player = players[0];
        player.to = game_numbers[1];
        return check(
          { player, msg: 'foo' },
          [
            { key: 'new-game', options: [player.nickname, player.avatar], to: player, from: game_numbers[1] }
          ]
        );
      });
    });

    describe('Inviting', () => {
      it('should send out an invite to a brand new player from the same game number with a regular onboarding process', () => {
        const players = getPlayers(3);
        const new_player = getPlayers(1)[0];
        return playGame(players).then(() => {
          return setup([
            { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] }
          ]);
        }).then(() => {
          return check(
            { player: players[0], msg: rule('invite').example() + new_player.number, to: game_numbers[1] },
            [
              { key: 'intro_5', options: [new_player.number], to: players[0], from: game_numbers[1] },
              { key: 'invite', options: [players[0].nickname, players[0].avatar], to: new_player, from: game_numbers[0] }
            ]
          );
        });
      });

      it('should send out an invite to an existing player in one game from the second game number with an abridged onboarding process', () => {
        const players = getPlayers(3);
        const existing_player = players[1];
        return playGame(players).then(() => {
          return setup([
            { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] }
          ]);
        }).then(() => {
          return check(
            { player: players[0], msg: rule('invite').example() + existing_player.number, to: game_numbers[1] },
            [
              { key: 'intro_existing_player', options: [existing_player.number], to: players[0], from: game_numbers[1] },
              { key: 'invite_existing_player', options: [existing_player.nickname, existing_player.avatar, players[0].nickname, players[0].avatar], to: existing_player, from: game_numbers[1] }
            ]
          );
        });
      });

      it('should invite an existing user to a new game and they join after emojis are sent', () => {
        const players = getPlayers(3);
        //const existing_player = players[1];
        return playGame(players).then(() => {
          return setup([
            { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
            { player: players[0], msg: rule('invite').example() + players[1].number, to: game_numbers[1] },
            { player: players[0], msg: rule('invite').example() + players[2].number, to: game_numbers[1] },
            { player: players[1], msg: rule('yes').example(), to: game_numbers[1] },
            { player: players[0], msg: EMOJI, to: game_numbers[1] }
          ]);
        }).then(() => {
          return check(
            { player: players[2], msg: rule('yes').example(), to: game_numbers[1] },
            [

              { from: game_numbers[1], to: players[0], key: 'accepted-invited', options: [players[2].nickname, players[2].avatar] },
              { from: game_numbers[1], to: players[1], key: 'join-game', options: [players[2].nickname, players[2].avatar] },
              { from: game_numbers[1], to: players[2], key: 'accepted-inviter-in-progress', options: [players[2].nickname, players[2].avatar, players[0].nickname, players[0].avatar] },
              { from: game_numbers[1], key: 'emojis', options: [players[0].nickname, players[0].avatar, EMOJI ], to: players[2] },
              { from: game_numbers[1], key: 'guessing-instructions', to: players[2] }
            ]
          );
        });
      });

      it('should invite an existing user to a new game and they join before the second round', () => {
        const players = getPlayers(3);
        //const existing_player = players[1];
        return playGame(players, true).then((phrase) => {
          return setup([
            { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
            { player: players[0], msg: rule('invite').example() + players[1].number, to: game_numbers[1] },
            { player: players[0], msg: rule('invite').example() + players[2].number, to: game_numbers[1] },
            { player: players[1], msg: rule('yes').example(), to: game_numbers[1] },
            { player: players[0], msg: EMOJI, to: game_numbers[1] },
            { player: players[1], msg: phrase, to: game_numbers[1] }
          ]);
        }).then(() => {
          return check(
            { player: players[2], msg: rule('yes').example(), to: game_numbers[1] },
            [

              { from: game_numbers[1], to: players[0], key: 'accepted-invited', options: [players[2].nickname, players[2].avatar] },
              { from: game_numbers[1], to: players[1], key: 'join-game', options: [players[2].nickname, players[2].avatar] },
              { from: game_numbers[1], to: players[2], key: 'accepted-inviter-in-progress', options: [players[2].nickname, players[2].avatar, players[0].nickname, players[0].avatar] },
              { from: game_numbers[1], key: 'emojis', options: [players[0].nickname, players[0].avatar, EMOJI ], to: players[2] },
              { from: game_numbers[1], key: 'guessing-instructions', to: players[2] }
            ]
          );
        });
      });
    });

    it('should be able to receive a text from a new game number and not create another user but create another player and another game', () => {
      const players = getPlayers(3);
      //const existing_player = players[1];
      return playGame(players).then(() => {
        return check(
          { player: players[0], msg: 'sup', to: game_numbers[1] },
          [
            { key: 'new-game', options: [players[0].nickname, players[0].avatar], to: players[0], from: game_numbers[1] }
          ]
        );
      });
    });

    it('should create a player on the same number the user is texting on', () => {
      const player = getPlayers(1)[0];
      player.to = game_numbers[1];
      return setup([
        { player, msg: 'hello' },
        { player, msg: 'y' },
        { player, msg: player.nickname }
      ]).then(() => {
        return check(
          { player, msg: EMOJI },
          [
            { key: 'intro_4', options: [ player.nickname, EMOJI ], to: player }
          ]);
      });
    });

    it('should create a player on a new number if user is already playing a game', () => {
      const players = getPlayers(2);
      const new_player = getPlayers(1)[0];
      return playGame(players).then(() => {
        return setup([
          { player: new_player, msg: 'hello' },
          { player: new_player, msg: 'y' },
          { player: new_player, msg: new_player.nickname },
          { player: new_player, msg: new_player.avatar }
        ]);
      }).then(() => {
        return check(
          { player: new_player, msg: rule('invite').example() + players[0].number },
          [
            { key: 'intro_existing_player', options: [players[0].number], to: new_player, from: game_numbers[0] },
            { key: 'invite_existing_player', options: [players[0].nickname, players[0].avatar, new_player.nickname, new_player.avatar], to: players[0], from: game_numbers[1] }
          ]
        );
      });
    });
  });

  describe('Illegal', () => {
    it('should disallow a player from starting a new game if already playing the maximum number of games', () => {
      const players = getPlayers(3);
      return playGame(players).then(() => {
        return setup([
          { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
          { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
          { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] }
        ]);
      }).then(() => {
        return check(
          { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
          [
            { key: 'error-maximum-games', to: players[0], from: game_numbers[0] }
          ]
        );
      });
    });

    it('should disallow a player from inviting a player currently playing the maximum number of games', () => {
      const players = getPlayers(3);
      return playGame(players).then(() => {
        return setup([
          { player: players[2], msg: rule('new-game').example(), to: game_numbers[0] },
          { player: players[2], msg: rule('new-game').example(), to: game_numbers[0] },
          { player: players[2], msg: rule('new-game').example(), to: game_numbers[0] },
          { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] }
        ]);
      }).then(() => {
        return check(
          { player: players[0], msg: rule('invite').example() + players[2].number, to: game_numbers[1] },
          [
            { key: 'error-12', to: players[0], from: game_numbers[1] }
          ]
        );
      });
    });

    it('should disallow a player from inviting a new player multiple times', () => {
      const players = getPlayers(3);
      const new_player = getPlayers(1)[0];
      return playGame(players).then(() => {
        return setup([
          { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
          { player: players[0], msg: rule('invite').example() + new_player.number, to: game_numbers[1] }
        ]);
      }).then(() => {
        return check(
          { player: players[0], msg: rule('invite').example() + new_player.number, to: game_numbers[1] },
          [
            { key: 'error-2', options: [new_player.number], to: players[0], from: game_numbers[1] }
          ]
        );
      });
    });

    it('should disallow a player from inviting an existing player multiple times', () => {
      const players = getPlayers(3);
      const existing_player = players[1];
      return playGame(players).then(() => {
        return setup([
          { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
          { player: players[0], msg: rule('invite').example() + existing_player.number, to: game_numbers[1] }
        ]);
      }).then(() => {
        return check(
          { player: players[0], msg: rule('invite').example() + existing_player.number, to: game_numbers[1] },
          [
            { key: 'error-2', options: [players[1].number], to: players[0], from: game_numbers[1] }
          ]
        );
      });
    });
  });

});
