'use strict';
var Promise = require('bluebird');
var rule = require('config/rule');
var User = require('models/user');
var Game = require('models/game');

module.exports = function(user, input, game_number) {
  if ( rule('invite').test(input) ) {
    return [{
      user: user,
      key: 'wait-to-invite'
    }];
  } else {
    // Once you set a nickname, we presume you're ready for
    // the big leagues.
    //
    // A.K.A., it's time to associate you with a game.
    if ( user.inviter ) {
      // if you've been invited, that means a
      // game already exists.
      return User.update(user, {
        nickname: input
      }).then(function() {
        return Game.get({ user: { id: user.inviter.id }, game_number: game_number });
      }).then(function(game) {
        if ( game.state === 'pending' ) {
          return startGame(game, user, input, game_number);
        } else if ( game.state === 'playing' ) {
          if ( ! game.round ) {
            console.error(game);
            throw "This should not happen, there should always be a round";
          }
          if ( game.round.state === 'waiting-for-submission' ) {
            // the user can jump in.
            // the round has yet to begin!
            return addPlayerToRound(game, user, input, game_number);
          } else if ( game.round.state === 'playing' ) {
            return addPlayerToBench(game, user, input, game_number);
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
      return createGame(user, input, game_number);
    }
  }
};

function addPlayerToBench(game, user, input, game_number) {
  // this means the invited user must wait until the next round
  game.players.push(user);

  User.update(user, {
    state: 'bench',
  });

  // add this invited user to the game
  return Game.add(game, [user], game_number).then(function() {
    return game.players.map(function(player) {

      if ( player.id === user.id ) {
        return {
          key: 'accepted-inviter-next-round',
          user: player,
          options: [
            input,
            user.inviter.nickname
          ]
        };
      } else if ( player.id === user.inviter.id ) {
        return {
          key: 'accepted-invited-next-round',
          user: player,
          options: [
            input,
            user.inviter.nickname
          ]
        };
      } else {
        return {
          key: 'join-game-next-round',
          user: player,
          options: [
            input
          ]
        };
      }
    });
  });
}

function addPlayerToRound(game, user, input, game_number) {
  // this means the invited user can join immediately
  game.players.push(user);

  User.update(user, {
    state: 'ready-for-game',
  });

  // add this invited user to the game
  return Game.add(game, [user], game_number).then(function() {
    return Game.get({ user: user, game_number: game_number});
  }).then(function(game) {
    return game.players.map(function(player) {
      if ( player.id === user.inviter.id ) {
        return {
          key: 'accepted-invited',
          user: player,
          options: [
            input,
            user.inviter.nickname
          ],
        };
      } else if ( player.id === user.id ) {
        return {
          key: 'accepted-inviter',
          user: player,
          options: [
            input,
            user.inviter.nickname
          ],
        };
      } else {
        return {
          key: 'join-game',
          user: player,
          options: [
            input
          ]
        };
      }
    });
  });
}

function startGame(game, user, input, game_number) {
  game.players.push(user);
  game.players.map(function(player) {
    // update each game player that its time to begin
    User.update(player, {
      state: 'ready-for-game',
    });
  });
  // add this invited user to the game
  return Promise.join(
    Game.add(game, [user], game_number),
    Game.start(game),
    Game.newRound(game),
    function(_1, _2, round) {
      let invitedMessage = {
        key: 'accepted-invited',
        options: [
          input,
          user.inviter.nickname
        ],
        user: user.inviter
      };
      let inviterMessage = {
        user: user,
        key: 'accepted-inviter',
        options: [
          input,
          user.inviter.nickname
        ]
      };

      User.update(round.submitter, {
        state: 'waiting-for-submission',
      });

      return [
        invitedMessage,
        inviterMessage,
        {
          key: 'game-start',
          user: round.submitter,
          options: [
            round.submitter.nickname,
            round.phrase
          ]
        }
      ];
    }
  );
}

function createGame(user, input, game_number) {
  console.log('create game');
  Game.create().then(function(game) {
    console.log('created game', game.id);
    return Game.add(game, [user], game_number);
  }).catch(function(err) {
    console.error('error adding user 1', err, user);
  });

  User.update(user, {
    state: 'waiting-for-invites',
    nickname: input
  });
  return new Promise(function(resolve) {
    resolve([{
      user: user,
      key: 'intro_3',
      options: [input]
    }]);
  });
}
