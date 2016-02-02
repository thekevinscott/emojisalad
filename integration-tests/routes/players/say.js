'use strict';
var Promise = require('bluebird');
var _ = require('lodash');
var Game = require('models/game');
var rule = require('config/rule');

module.exports = function(player, input, game_number) {
  if ( rule('invite').test(input) ) {
    return require('../players/invite')(player, input, game_number);
  } else if ( rule('new-game').test(input) ) {
    return require('../games/new-game')(player, input, game_number);
  } else if ( rule('clue').test(input) ) {
    return require('../games/clue')(player, input, game_number);
  } else if ( rule('help').test(input) ) {
    return require('../players/help')(player, input, game_number);
  } else if ( rule('guess').test(input) ) {
    return require('../games/guess')(player, input, game_number);
  } else if ( rule('pass').test(input) ) {
    return require('../games/pass')(player, input, game_number);
  } else {
    return Promise.join(
      Game.get({ player: player, game_number: game_number }),
      function(game) {
        var message = {
          key: 'says',
          options: [
            player.nickname,
            player.avatar,
            input
          ]
        };
        return game.players.map(function(game_player) {
          if ( game_player.id !== player.id ) {
            return _.assign({
              //number: player.number,
              player: game_player
            },
            message);
          }
        }).filter((el) => el);
      }
    );
  }
};
