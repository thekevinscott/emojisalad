var User = require('../../models/user');
var Message = require('../../models/message');
var Game = require('../../models/game');
var Promise = require('bluebird');

module.exports = function(user, input) {
  return Promise.join(
    Message.get('says', [user.nickname, input]),
    Game.get({ user: user }),
    function(message, game) {
      message.type = 'sms';
      var messages = [];
      game.players.map(function(player) {
        if ( player.id !== user.id ) {
          message.number = player.number;
          messages.push(message);
        }
      });
      return messages;
    }
  );
}

