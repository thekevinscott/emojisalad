'use strict';
//var Player = require('../../models/player');
//var Message = require('../../models/message');
const Game = require('models/game');
const Round = require('models/round');
const _ = require('lodash');

module.exports = function(player, input, game_number) {
  if ( player.state === 'passed' ) {
    return [{
      player: player,
      key: 'no-clue-after-passing'
    }];
  } else {
    return Game.get({ player: player, game_number: game_number }).then(function(game) {
      return Round.getCluesLeft(game).then(function(clues_left) {
        if ( clues_left > 0 ) {
          return Round.getClue(game, player).then(function(roundClue) {
            if ( roundClue ) {
              return {
                key: 'clue',
                options: [
                  player.nickname,
                  roundClue.clue
                ]
              };
            } else {
              return {
                key: 'no-more-clues-available',
              };
            }
          });
        } else {
          var clues_allowed = game.round.clues_allowed;
          clues_allowed = (clues_allowed === 1) ? '1 clue' : clues_allowed + ' clues';

          return {
            key: 'no-more-clues-allowed',
            options: [
              clues_allowed
            ]
          };
        }
      }).then(function(message) {
        return game.players.map(function(game_player) {
          return _.assign({
            player: game_player,
          }, message);
        });
      }).then(function(messages) {
        return game.players.map(function(game_player) {
          if ( game_player.id !== player.id ) {
            return {
              key: 'says',
              player: game_player,
              options: [
                player.nickname,
                input
              ]
            };
          }
        //}).filter(function(el) { return el; }).concat(messages);
        }).filter((el) => el).concat(messages);
      });
    });
  }
};

