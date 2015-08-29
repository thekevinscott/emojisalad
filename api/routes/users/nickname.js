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
      console.log('youve been invited', user.inviter_id);
      // if you've been invited, that means a
      // game already exists.
      return Game.get({ user: { id: user.inviter.id }}).then(function(game) {
        game.players.push(user);
        game.players.map(function(player) {
          // update each game player that its time to begin
          User.update(player, {
            state: 'ready-for-game',
          });
        });
        // add this invited user to the game
        return Promise.join(
          Game.add(game, [user.inviter.nickname]),
          Message.get('accepted-invited', [input, user.inviter.nickname]),
          Message.get('accepted-inviter', [input, user.inviter.nickname]),
          function(addResults, invitedMessage, inviterMessage) {
            inviterMessage.type = 'respond';
            invitedMessage.type = 'sms';
            invitedMessage.number = user.inviter.number;
            return [
              invitedMessage,
              inviterMessage
            ];

          }
        );
      });
    } else {
      Game.create().then(function(game) {
        return Game.add(game, [user]);
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
