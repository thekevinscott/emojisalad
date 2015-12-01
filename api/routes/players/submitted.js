'use strict';
const Promise = require('bluebird');
const _ = require('lodash');
const Game = require('models/game');
const rule = require('config/rule');

module.exports = function(player, input, game_number) {
  if ( rule('invite').test(input) ) {
    return require('../players/invite')(player, input, game_number);
  } else if ( rule('new-game').test(input) ) {
    return require('../games/new-game')(player, input, game_number);
  } else if ( rule('help').test(input) ) {
    return require('../players/help')(player, input, game_number);
  } else if ( rule('pass').test(input) ) {
    return require('../games/pass')(player, input, game_number);
  } else if ( /^clue/i.test(input) ) {
    return Game.get({ player: player, game_number: game_number }).then(function(game) {
      var message = {
        key: 'says',
        options: [
          player.nickname,
          input
        ]
      };
      var messages = game.players.map(function(game_player) {
        if ( game_player.id !== player.id ) {
          return _.assign({
            player: game_player
          },
          message);
        }
      }).filter((el) => el);

      messages = messages.concat(game.players.map(function(game_player) {
        return {
          player: game_player,
          key: 'no-clue-for-submitter'
        };
      }));
      return messages;
    });
        
  } else {
    return Promise.join(
      Game.get({ player: player, game_number: game_number }),
      function(game) {
        
        var message = {
          key: 'says',
          options: [
            player.nickname,
            input
          ]
        };
        var messages = game.players.map(function(game_player) {
          if ( game_player.id !== player.id ) {
            return _.assign({
              player: game_player
            },
            message);
          }
        }).filter((el) => el);

        // check that the submitter has not just guessed their own clue
        var regex = new RegExp(game.round.phrase, 'i');
        if ( regex.test(input) ) {
          messages = messages.concat(game.players.map(function(game_player) {
            return {
              key: 'submitter-dont-guess',
              player: game_player,
              options: [
                player.nickname
              ]
            };
          }));
        }

        return messages;

      }
    );
  }
};

