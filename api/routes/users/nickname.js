var User = require('../../models/user');
var Game = require('../../models/game');
var Message = require('../../models/message');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(user, input) {
  if ( /^invite/.test(input) ) {
    return Message.get('wait-to-invite').then(function(message) {
      message.type = 'respond';
      return [message];
    });
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
          //console.log('\n\n\n######');
          //console.log('what is teh state of hte round', game.round);
          if ( game.round.state === 'pending' ) {
            // the user can jump in.
            // the round has yet to begin!
            return addPlayerToRound(game, user, input);
          } else if ( game.round.state === 'playing' ) {
            return addPlayerToBench(game, user, input);
          } else {
            console.log('game', game);
            console.log('round', game.round);
          }
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
    Message.get('accepted-inviter-next-round', [input, user.inviter.nickname]),
    Message.get('accepted-invited-next-round', [input, user.inviter.nickname]),
    Message.get('join-game-next-round', [input]),
    function(_1, inviterMessage, invitedMessage, joinMessage) {
      inviterMessage.type = 'respond';
      inviterMessage.options = [
        input,
        user.inviter.nickname
      ];

      invitedMessage.type = 'sms';
      invitedMessage.number = user.inviter.number;
      invitedMessage.user = user.inviter;

      joinMessage.type = 'sms';

      var messages = [inviterMessage, invitedMessage];

      //console.log('game players', game.players);

      //messages.push(_.assign({}, inviterMessage, {
        //user: user.inviter,
        //number: user.inviter.number
      //}));

      game.players.map(function(player) {
        if ( player.id !== user.id ) {
          messages.push(_.assign({}, joinMessage, {
            user: player,
            number: player.number
          }));
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
    Message.get('accepted-invited', [input, user.inviter.nickname]),
    Message.get('accepted-inviter', [input, user.inviter.nickname]),
    Message.get('join-game', [input]),
    function(_1, invitedMessage, inviterMessage, joinMessage) {
      inviterMessage.type = 'respond';
      invitedMessage.type = 'sms';
      joinMessage.type = 'sms';
      invitedMessage.number = user.inviter.number;
      invitedMessage.user = user.inviter;

      var messages = [inviterMessage, invitedMessage];

      game.players.map(function(player) {
        if ( player.id !== user.inviter.id && player.id !== user.id ) {
          messages.push(_.assign({}, joinMessage, {
            user: player,
            number: player.number
          }));
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
    Message.get('accepted-invited', [input, user.inviter.nickname]),
    Message.get('accepted-inviter', [input, user.inviter.nickname]),
    Game.newRound(game),
    function(_1, _2, invitedMessage, inviterMessage, round) {
      inviterMessage.type = 'respond';
      invitedMessage.type = 'sms';
      invitedMessage.number = user.inviter.number;

      console.log('set user to waiting-for-submission', round.submitter);
      User.update(round.submitter, {
        state: 'waiting-for-submission',
      });

      return Message.get('game-start', [round.submitter.nickname, round.phrase]).then(function(gameStart) {
        gameStart.type = 'sms';
        gameStart.number = round.submitter.number;
        return [
          invitedMessage,
          inviterMessage,
          gameStart 
        ];
      });

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
  return Message.get('intro_3', [input]).then(function(message) {
    message.type = 'respond';
    return [message];
  });
}
