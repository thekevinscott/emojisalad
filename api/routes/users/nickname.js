var User = require('../../models/user');
var Game = require('../../models/game');
var Message = require('../../models/message');
var Promise = require('bluebird');

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
        //console.log('what is game', game);
        game.players.push(user);
        game.players.map(function(player) {
          // update each game player that its time to begin
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
      });
    } else {
      Game.create().then(function(game) {
        return Game.add(game, [user]);
      }).catch(function(err) {
        console.log('error adding user', err, user);
      });

      User.update(user, {
        state: 'waiting-for-invites',
        nickname: input
      });
      return Message.get('intro_3', [input]).then(function(message) {
        message.type = 'respond';
        return [message];
      });
    }
  }
}
