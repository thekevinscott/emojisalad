'use strict';
const _ = require('lodash');
const Game = require('models/game');
const rule = require('config/rule');

module.exports = function(player, input, game_number) {
  if ( rule('invite').test(input) ) {
    return require('../players/invite')(player, input, game_number);
  } else if ( rule('help').test(input) ) {
    return require('../players/help')(player, input, game_number);
  } else {
    let type_of_input = Game.checkInput(input);

    if ( type_of_input === 'text' ) {
      return require('../players/say')(player, input, game_number);
    } else if ( type_of_input === 'mixed-emoji' ) {
      return require('../players/say')(player, input, game_number).then(function(responses) {
        return responses.concat([
          {
            player: player,
            key: 'mixed-emoji',
            options: [player.nickname]
          }
        ]);
      });
    } else if ( type_of_input === 'emoji' ) {
      return Game.saveSubmission(player, input, game_number).then(function(game) {
        var messages = [{
          player: player,
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

        game.round.players.map(function(game_player) {
          messages.push(_.assign({ player: game_player }, forwarded_message));
        });

        game.round.players.map(function(game_player) {
          messages.push(_.assign({ player: game_player }, guessing_instructions));
        });
        return messages;
      }).catch(function(error) {
        console.error('there is an error', error);
        if ( error && parseInt(error.message) ) {
          return [{
            player: player,
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

