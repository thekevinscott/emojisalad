var User = require('../../models/user');
var Game = require('../../models/game');
//var Message = require('../../models/message');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(user, input) {
  if ( /^invite(.*)/i.test(input) ) {
    return require('../users/invite')(user, input);
  } else if ( ! Game.checkInput(input) ) {
    return [{
      type: 'respond',
      key: 'error-9'
    }];
    //return Message.get('error-9').then(function(message) {
      //message.type = 'respond';
      //return [message];
    //});
  } else {

    return Game.saveSubmission(user, input).then(function(game) {
      //return Promise.join(
        //Message.get('game-submission-sent'),
        //Message.get('says', [game.round.submitter.nickname, input]),
        //Message.get('guessing-instructions'),
        //function(message, forwardedMessage, guessingInstructions) {
          //console.log('saved submission');
          var messages = [{
            type: 'respond',
            key: 'game-submission-sent'
          }];

          var forwarded_message = {
            type: 'sms',
            key: 'says',
            options: [
              game.round.submitter.nickname, input
            ]
          };
          //forwardedMessage.type = 'sms';
          //forwardedMessage.options = [
            //game.round.submitter.nickname, input
          //];
          var guessing_instructions = {
            type: 'sms',
            key: 'guessing-instructions'
            //options: [
            //]
          };
          //guessingInstructions.type = 'sms';
          //console.log('the players', game.round.players);
          game.round.players.map(function(player) {
            messages.push(_.assign({ user: player }, forwarded_message));
            messages.push(_.assign({ user: player }, guessing_instructions));
          });
          return messages;
        //}
      //);
      //res.json(game);
    }).catch(function(error) {
      console.log('there is an error', error);
      if ( error && parseInt(error.message) ) {
        return [{
          type: 'respond',
          key: 'error-' + error.message,
          options: [input]
        }];
        //return Message.get('error-'+error.message, [input]).then(function(message) {
          //message.type = 'respond';
          //return [message];
        //});
      } else {
        throw error;
      }
    });
  }
};

