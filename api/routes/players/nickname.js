'use strict';
var Promise = require('bluebird');
var rule = require('config/rule');
var Player = require('models/player');
var Game = require('models/game');

module.exports = function(player, input, game_number) {
  if ( rule('invite').test(input) ) {
    return [{
      player: player,
      key: 'wait-to-invite'
    }];
  } else {
    // Once you set a nickname, we presume you're ready for
    // the big leagues.
    //
    // A.K.A., it's time to associate you with a game.
    if ( player.inviter ) {
      // if you've been invited, that means a
      // game already exists.
      return Player.update(player, {
        nickname: input
      }).then(function() {
        return Game.get({ player: { id: player.inviter.id }, game_number: game_number });
      }).then(function(game) {
        if ( game.state === 'pending' ) {
          return startGame(game, player, input, game_number);
        } else if ( game.state === 'playing' ) {
          if ( ! game.round ) {
            console.error(game);
            throw "This should not happen, there should always be a round";
          }
          if ( game.round.state === 'waiting-for-submission' ) {
            // the player can jump in.
            // the round has yet to begin!
            return addPlayerToRound(game, player, input, game_number);
          } else if ( game.round.state === 'playing' ) {
            return addPlayerToBench(game, player, input, game_number);
          } else {
            console.error("Game round has no state", game.round.state, game.round);
            throw new Error("Game round has no state");
          }
        } else {
          console.error("Game has no state", game);
          throw new Error("Game has no state");
        }
      });
    } else {
      return createGame(player, input, game_number);
    }
  }
};

function addPlayerToBench(game, player, input, game_number) {
  // this means the invited player must wait until the next round
  game.players.push(player);

  Player.update(player, {
    state: 'bench',
  });

  // add this invited player to the game
  return Game.add(game, [player], game_number).then(function() {
    return game.players.map(function(game_player) {

      if ( game_player.id === player.id ) {
        return {
          key: 'accepted-inviter-next-round',
          player: game_player,
          options: [
            input,
            player.inviter.nickname
          ]
        };
      } else if ( game_player.id === player.inviter.id ) {
        return {
          key: 'accepted-invited-next-round',
          player: game_player,
          options: [
            input,
            player.inviter.nickname
          ]
        };
      } else {
        return {
          key: 'join-game-next-round',
          player: game_player,
          options: [
            input
          ]
        };
      }
    });
  });
}

function addPlayerToRound(game, player, input, game_number) {
  // this means the invited player can join immediately
  game.players.push(player);

  Player.update(player, {
    state: 'ready-for-game',
  });

  // add this invited player to the game
  return Game.add(game, [player], game_number).then(function() {
    return Game.get({ player: player, game_number: game_number});
  }).then(function(game) {
    return game.players.map(function(game_player) {
      if ( game_player.id === player.inviter.id ) {
        return {
          key: 'accepted-invited',
          player: game_player,
          options: [
            input,
            player.inviter.nickname
          ],
        };
      } else if ( game_player.id === player.id ) {
        return {
          key: 'accepted-inviter',
          player: game_player,
          options: [
            input,
            player.inviter.nickname
          ],
        };
      } else {
        return {
          key: 'join-game',
          player: game_player,
          options: [
            input
          ]
        };
      }
    });
  });
}

function startGame(game, player, input, game_number) {
  game.players.push(player);
  game.players.map(function(game_player) {
    // update each game player that its time to begin
    Player.update(game_player, {
      state: 'ready-for-game',
    });
  });
  // add this invited player to the game
  return Promise.join(
    Game.add(game, [player], game_number),
    Game.start(game),
    Game.newRound(game),
    function(_1, _2, round) {
      let invitedMessage = {
        key: 'accepted-invited',
        options: [
          input,
          player.inviter.nickname
        ],
        player: player.inviter
      };
      let inviterMessage = {
        player: player,
        key: 'accepted-inviter',
        options: [
          input,
          player.inviter.nickname
        ]
      };

      Player.update(round.submitter, {
        state: 'waiting-for-submission',
      });

      return [
        invitedMessage,
        inviterMessage,
        {
          key: 'game-start',
          player: round.submitter,
          options: [
            round.submitter.nickname,
            round.phrase
          ]
        }
      ];
    }
  );
}

function createGame(player, input, game_number) {
  Game.create().then(function(game) {
    return Game.add(game, [player], game_number);
  }).catch(function(err) {
    console.error('error adding player 1', err, player);
  });

  Player.update(player, {
    state: 'waiting-for-invites',
    nickname: input
  });
  return new Promise(function(resolve) {
    resolve([{
      player: player,
      key: 'intro_3',
      options: [input]
    }]);
  });
}
