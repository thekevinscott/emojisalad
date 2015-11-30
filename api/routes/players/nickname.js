'use strict';
const Promise = require('bluebird');
const rule = require('config/rule');
const Player = require('models/player');
const User = require('models/user');
const Game = require('models/game');
const Invite = require('models/invite');

module.exports = Promise.coroutine(function* (player, input, game_number) {
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
    let inviter = yield Invite.getInviter(player);
    if ( inviter ) {
      // if you've been invited, that means a
      // game already exists.
      player.user = yield User.update({ id: player.user.id }, {
        nickname: input
      });
      player.nickname = player.user.nickname;
      player.inviter = inviter;

      let game = yield Game.get({ player: player.inviter });
      if ( ! game ) {
        console.error('no game found for inviter', player.inviter);
        throw "No game found";
      } else if ( game.state === 'pending' ) {
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
    } else {
      return createGame(player, input, game_number);
    }
  }
});

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

var startGame = Promise.coroutine(function* (unstarted_game, player, input, game_number) {
  unstarted_game.players.push(player);
  unstarted_game.players.map(function(game_player) {
    // update each game player that its time to begin
    Player.update(game_player, {
      state: 'ready-for-game',
    });
  });
  // add this invited player to the game
  yield Game.add(unstarted_game, [player], game_number);
  let game = yield Game.start(unstarted_game);

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

  yield Player.update(game.round.submitter, {
    state: 'waiting-for-submission',
  });

  return [
    invitedMessage,
    inviterMessage,
    {
      key: 'game-start',
      player: game.round.submitter,
      options: [
        game.round.submitter.nickname,
        game.round.phrase
      ]
    }
  ];
});

var createGame = Promise.coroutine(function* (player, input, game_number) {
  Game.create().then(function(game) {
    return Game.add(game, [player], game_number);
  }).catch(function(err) {
    console.error('error adding player 1', err, player);
  });

  player = yield Player.update(player, {
    state: 'waiting-for-invites',
  });
  User.update({ id: player.user.id }, {
    nickname: input
  });

  return [{
    player: player,
    key: 'intro_3',
    options: [input]
  }];
});
