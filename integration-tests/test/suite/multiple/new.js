'use strict';
const getPlayers = require('lib/getPlayers');
const playGame = require('flows/playGame');
const startGame = require('flows/startGame');
const signup = require('flows/signup');
const setup = require('lib/setup');
const getPhrase = require('lib/getPhrase');
const check = require('lib/check');
const rule = require('../../../config/rule');
const guess = rule('guess').example();
const EMOJI = '😀';

const game_numbers = require('../../../../config/numbers');

describe('New Game', () => {
  describe('Legal', () => {
    it('should initiate a new game from a second phone number and prompt for invites', () => {
      const players = getPlayers(3);
      return playGame(players).then(() => {
        return check(
          { player: players[0], msg: rule('new-game').example() },
          [
            { key: 'new-game', options: [players[0].nickname, players[0].avatar], to: players[0], from: game_numbers[1] },
          ]
        );
      });
    });

    describe('Inviting', () => {
      it('should send out an invite to a brand new player from the first game number with a regular onboarding process', () => {
        const players = getPlayers(3);
        const new_player = getPlayers(1)[0];
        return playGame(players).then(() => {
          return setup([
            { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
          ]);
        }).then(() => {
          return check(
            { player: players[0], msg: rule('invite').example() + new_player.number, to: game_numbers[1] },
            [
              { key: 'intro_5', options: [new_player.number], to: players[0], from: game_numbers[1] },
              { key: 'invite', options: [players[0].nickname], to: new_player, from: game_numbers[0]  }
            ]
          );
        });
      });

      it('should send out an invite to an existing player in one game from the second game number with an abridged onboarding process', () => {
        const players = getPlayers(3);
        const existing_player = players[1];
        return playGame(players).then(() => {
          return setup([
            { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
          ]);
        }).then(() => {
          return check(
            { player: players[0], msg: rule('invite').example() + existing_player.number, to: game_numbers[1] },
            [
              { key: 'intro_existing_player', options: [existing_player.number], to: players[0], from: game_numbers[1] },
              { key: 'invite_existing_player', options: [existing_player.nickname, players[0].nickname], to: existing_player, from: game_numbers[1]  }
            ]
          );
        });
      });
    });
  });

  describe('Illegal', () => {
    it('should disallow a player from starting a new game if already playing the maximum number of games', () => {
      const players = getPlayers(3);
      return playGame(players).then(() => {
        return Player.get(players[0]).then((player) => {
          return User.update(player.user, { maximum_games: 2 });
        });
      }).then(() => {
        return setup([
          { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
        ]);
      }).then(() => {
        return check(
          { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
          [
            { key: 'error-maximum-games', to: players[0], from: game_numbers[0] },
          ]
        );
      });
    });

    it('should disallow a player from inviting a player currently playing the maximum number of games', () => {
      const players = getPlayers(3);
      return playGame(players).then(() => {
        return Player.get(players[0]).then((player) => {
          return User.update(player.user, { maximum_games: 2 });
        });
      }).then(() => {
        return setup([
          { player: players[2], msg: rule('new-game').example(), to: game_numbers[0] },
          { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
        ]);
      }).then(() => {
        return check(
          { player: players[0], msg: rule('invite').example() + players[2].number, to: game_numbers[1] },
          [
            { key: 'error-12', to: players[0], from: game_numbers[1] },
          ]
        );
      });
    });

    it('should disallow a player from starting a new game if they have not finished onboarding', () => {
      const player = getPlayers(1)[0];
      return setup([
        { player: player, msg: 'hello' },
        { player: player, msg: 'y' },
      ]).then(() => {
        return check(
          { player: player, msg: rule('new-game').example() },
          [
            { key: 'error-13', to: player }
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
          { player: players[0], msg: rule('invite').example() + new_player.number, to: game_numbers[1] },
        ]);
      }).then(() => {
        return check(
          { player: players[0], msg: rule('invite').example() + new_player.number, to: game_numbers[1] },
          [
            { key: 'error-2', options: [new_player.number], to: players[0], from: game_numbers[1] },
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
          { player: players[0], msg: rule('invite').example() + existing_player.number, to: game_numbers[1] },
        ]);
      }).then(() => {
        return check(
          { player: players[0], msg: rule('invite').example() + existing_player.number, to: game_numbers[1] },
          [
            { key: 'error-2', options: [players[1].number], to: players[0], from: game_numbers[1] },
          ]
        );
      });
    });
  });

  it('should be able to receive a text from a new game number and not create another user but create another player and another game', () => {
    const players = getPlayers(3);
    //const existing_player = players[1];
    return playGame(players).then(() => {
      //return setup([
        //{ player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
        //{ player: players[0], msg: rule('invite').example() + existing_player.number, to: game_numbers[1] },
      //]);
    }).then(() => {
      return check(
        { player: players[0], msg: 'sup', to: game_numbers[1] },
        [
          { key: 'new-game', options: [players[0].nickname], to: players[0], from: game_numbers[1] },
        ]
      );
    });
  });

  it('should mark an invite as used after using it', () => {
    const players = getPlayers(2);
    const existing_player = players[1];
    return playGame(players).then(() => {
      return setup([
        { player: players[0], msg: rule('new-game').example(), to: game_numbers[0] },
        { player: players[0], msg: rule('invite').example() + existing_player.number, to: game_numbers[1] },
        { player: existing_player, msg: 'yes', to: game_numbers[1] },
      ]);
    }).then(() => {
      return Player.get(existing_player);
    }).then((player) => {
      return Invite.getInvite(player);
    }).then((invite) => {
      invite.used.should.equal(1);
    });
  });
});
