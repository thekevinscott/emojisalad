var User = require('../../models/user');
var Game = require('../../models/game');
//var Message = require('../../models/message');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(user, input) {
  if ( /^invite/.test(input) ) {
    return [{
      type: 'respond',
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
        return Game.get({ user: { id: user.inviter.id }});
      }).then(function(game) {
        if ( game.state === 'pending' ) {
          return startGame(game, user, input);
        } else if ( game.state === 'playing' ) {
          console.log('game roudn state', game.round);
          if ( game.round.state === 'pending' ) {
            // the user can jump in.
            // the round has yet to begin!
            return addPlayerToRound(game, user, input);
          } else if ( game.round.state === 'playing' ) {
            return addPlayerToBench(game, user, input);
          } else {
            cnosole.error("Game round has no state", game);
            throw new Error("Game round has no state");
          }
        } else {
          cnosole.error("Game has no state", game);
          throw new Error("Game has no state");
        }
      });
    } else {
      return createGame(user, input);
    }
  }
}

function addPlayerToBench(game, user, input) {
  // this means the invited user can join immediately
  game.players.push(user);

  User.update(user, {
    state: 'bench',
  });

  // add this invited user to the game
  return Promise.join(
    Game.add(game, [user]),
    //Message.get('accepted-inviter-next-round', [input, user.inviter.nickname]),
    //Message.get('accepted-invited-next-round', [input, user.inviter.nickname]),
    //Message.get('join-game-next-round', [input]),
    function(_1, inviterMessage, invitedMessage, joinMessage) {
      inviterMessage = {
        key: 'accepted-inviter-next-round',
        type: 'respond',
        options: [ 
          input,
          user.inviter.nickname
        ]
      }

      invitedMessage = {
        key: 'accepted-invited-next-round',
        type: 'sms',
        user: user.inviter,
        options: [
          input,
          user.inviter.nickname
        ]
      }

      joinMessage = {
        key: 'join-game-next-round',
        type: 'sms',
        options: [
          input
        ]
      }

      var messages = [inviterMessage, invitedMessage];

      game.players.map(function(player) {
        if ( player.id !== user.id ) {
          messages.push(_.assign({
            user: player,
          }, joinMessage));
        }
      });

      return messages;
    }
  );
}

function addPlayerToRound(game, user, input) {
  // this means the invited user can join immediately
  game.players.push(user);

  User.update(user, {
    state: 'ready-for-game',
  });

  // add this invited user to the game
  return Promise.join(
    Game.add(game, [user]),
    //Message.get('accepted-invited', [input, user.inviter.nickname]),
    //Message.get('accepted-inviter', [input, user.inviter.nickname]),
    //Message.get('join-game', [input]),
    function(_1, invitedMessage, inviterMessage, joinMessage) {
      inviterMessage = {
        key: 'accepted-inviter',
        type: 'respond',
        options: [
          input,
          user.inviter.nickname
        ]
      };
      invitedMessage = {
        key: 'accepted-invited',
        type: 'sms',
        options: [
          input,
          user.inviter.nickname
        ],
        user: user.inviter
      };
      joinMessage = {
        key: 'join-game',
        type: 'sms',
        options: [
          input
        ]
      }

      var messages = [inviterMessage, invitedMessage];

      game.players.map(function(player) {
        if ( player.id !== user.inviter.id && player.id !== user.id ) {
          messages.push(_.assign({
            user: player,
            //number: player.number
          }, joinMessage));
        }
      });

      return messages;
    }
  );
}

function startGame(game, user, input) {
  game.players.push(user);
  game.players.map(function(player) {
    // update each game player that its time to begin
    console.log('set user to ready-for-game', player);
    User.update(player, {
      state: 'ready-for-game',
    });
  });
  // add this invited user to the game
  return Promise.join(
    Game.add(game, [user]),
    Game.start(game),
    //Message.get('accepted-invited', [input, user.inviter.nickname]),
    //Message.get('accepted-inviter', [input, user.inviter.nickname]),
    Game.newRound(game),
    function(_1, _2, /*invitedMessage, inviterMessage,*/ round) {
      invitedMessage = {
        key: 'accepted-invited',
        options: [
          input,
          user.inviter.nickname
        ],
        type: 'sms',
        user: user.inviter
      };
      inviterMessage = {
        type: 'respond',
        key: 'accepted-inviter',
        options: [
          input,
          user.inviter.nickname
        ]
      }

      //console.log('set user to waiting-for-submission', round.submitter);
      User.update(round.submitter, {
        state: 'waiting-for-submission',
      });

      return [
        invitedMessage,
        inviterMessage,
        {
          type: 'sms',
          key: 'game-start',
          user: round.submitter,
          options: [
            round.submitter.nickname,
            round.phrase
          ]
        }
      ];
      //return Message.get('game-start', [round.submitter.nickname, round.phrase]).then(function(gameStart) {
        //gameStart.type = 'sms';
        //gameStart.number = round.submitter.number;
        //return [
          //invitedMessage,
          //inviterMessage,
          //gameStart 
        //];
      //});

    }
  );
}

function createGame(user, input) {
  Game.create().then(function(game) {
    return Game.add(game, [user]);
  }).catch(function(err) {
    console.log('error adding user', err, user);
  });

  console.log('set user to wait for invites', user);
  User.update(user, {
    state: 'waiting-for-invites',
    nickname: input
  });
  console.log('this is what we return');
  return new Promise(function(resolve) {
    resolve([{
      type: 'respond',
      key: 'intro_3',
      options: [input]
    }]);
  });
  //return Message.get('intro_3', [input]).then(function(message) {
    //message.type = 'respond';
    //return [message];
  //});
}
