var User = require('../../models/user');
//var Message = require('../../models/message');
var Game = require('../../models/game');
var Round = require('../../models/round');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(user, input) {

  return Game.get({ user: user }).then(function(game) {
    return Round.getCluesLeft(game).then(function(clues_left) {
      if ( clues_left > 0 ) {
        return Round.getClue(game, user).then(function(roundClue) {

          if ( roundClue ) {
            var message = {
              key: 'clue',
              options: [
                user.nickname,
                roundClue.clue
              ]
            };

          } else {
            var message = {
              key: 'no-more-clues-available',
            };
          }
          return message;
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
      return game.players.map(function(player) {
        //console.log('users', player.id);
        return _.assign({
          user: player,
        }, message);
      });
    }).then(function(messages) {
      return game.players.map(function(player) {
        //console.log('users', player.id);
        if ( player.id !== user.id ) {
          return {
            key: 'says',
            user: player,
            options: [
              user.nickname,
              input
            ]
          };
        }
      }).filter(function(el) { return el; }).concat(messages);
    });
  });
}

