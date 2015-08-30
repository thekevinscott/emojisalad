var User = require('../../models/user');
var Game = require('../../models/game');
var Message = require('../../models/message');
var Promise = require('bluebird');

module.exports = function(user, input) {
  if ( ! Game.checkInput(input) ) {
    return Message.get('error-9').then(function(message) {
      message.type = 'respond';
      return [message];
    });
  }

  return Game.saveSubmission(user, input).then(function(game) {
    return Promise.join(
      Message.get('game-submission-sent'),
      Message.get('says', [game.round.submitter.nickname, input]),
      Message.get('guessing-instructions'),
      function(message, forwardedMessage, guessingInstructions) {
        message.type = 'respond';
        var messages = [message];
        forwardedMessage.type = 'sms';
        guessingInstructions.type = 'sms';
        game.round.players.map(function(player) {
          forwardedMessage.number = player.number;
          guessingInstructions.number = player.number;
          messages.push(forwardedMessage);
          messages.push(guessingInstructions);
        });
        return [
          message,
          forwardedMessage,
          guessingInstructions
        ];
      }
    );
    //res.json(game);
  }).catch(function(error) {
    console.log('there is an error', error);
    if ( error && parseInt(error.message) ) {
      return Message.get('error-'+error.message, [input]).then(function(message) {
        message.type = 'respond';
        return [message];
      });
    } else {
      throw error;
    }
  });
};

