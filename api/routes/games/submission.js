'use strict';
var _ = require('lodash');
var Game = require('models/game');
var rule = require('config/rule');

module.exports = function(user, input, game_number) {
  if ( rule('invite').test(input) ) {
    return require('../users/invite')(user, input, game_number);
  } else if ( rule('help').test(input) ) {
    return require('../users/help')(user, input, game_number);
  } else {
    let type_of_input = Game.checkInput(input);

    if ( type_of_input === 'text' ) {
      return require('../users/say')(user, input, game_number);
    } else if ( type_of_input === 'mixed-emoji' ) {
      return require('../users/say')(user, input, game_number).then(function(responses) {
        return responses.concat([
          {
            user: user,
            key: 'mixed-emoji',
            options: [user.nickname]
          }
        ]);
      });
    } else if ( type_of_input === 'emoji' ) {
      return Game.saveSubmission(user, input, game_number).then(function(game) {
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
  }
};

