'use strict';
var Promise = require('bluebird');
var _ = require('lodash');
var Game = require('models/game');
var rule = require('config/rule');

module.exports = function(user, input, game_number) {
  if ( rule('invite').test(input) ) {
    return require('../users/invite')(user, input);
  } else if ( rule('clue').test(input) ) {
    return require('../games/clue')(user, input);
  } else if ( rule('help').test(input) ) {
    return require('../users/help')(user, input);
  } else if ( rule('guess').test(input) ) {
    return require('../games/guess')(user, input);
  } else if ( rule('pass').test(input) ) {
    return require('../games/pass')(user, input);
  } else {
    return Promise.join(
      Game.get({ user: user, game_number: game_number }),
      function(game) {
        var message = {
          key: 'says',
          options: [
            user.nickname,
            input
          ]
        };
        return game.players.map(function(player) {
          if ( player.id !== user.id ) {
            return _.assign({
              //number: player.number,
              user: player
            },
            message);
          }
        //}).filter(function(el) { return el; });
        }).filter((el) => el);
      }
    );
  }
};
