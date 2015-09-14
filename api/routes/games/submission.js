'use strict';
var _ = require('lodash');
var Game = require('models/game');
var rule = require('config/rule');

module.exports = function(user, input) {
  if ( rule('invite').test(input) ) {
    return require('../users/invite')(user, input);
  } else if ( 0 && ! Game.checkInput(input) ) {
    return [{
      user: user,
      key: 'error-9'
    }];
  } else {

    return Game.saveSubmission(user, input).then(function(game) {
      var messages = [{
        user: user,
        key: 'game-submission-sent'
      }];

      var forwarded_message = {
        key: 'says',
        options: [
          game.round.submitter.nickname, input
        ]
      };

      var guessing_instructions = {
        key: 'guessing-instructions'
      };

      game.round.players.map(function(player) {
        messages.push(_.assign({ user: player }, forwarded_message));
      });

      game.round.players.map(function(player) {
        messages.push(_.assign({ user: player }, guessing_instructions));
      });
      return messages;
    }).catch(function(error) {
      console.error('there is an error', error);
      if ( error && parseInt(error.message) ) {
        return [{
          user: user,
          key: 'error-' + error.message,
          options: [input]
        }];
      } else {
        throw error;
      }
    });
  }
};

