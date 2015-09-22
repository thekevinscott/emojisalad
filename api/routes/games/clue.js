'use strict';
//var User = require('../../models/user');
//var Message = require('../../models/message');
const Game = require('models/game');
const Round = require('models/round');
const _ = require('lodash');

module.exports = function(user, input) {
  if ( user.state === 'passed' ) {
    return [{
      user: user,
      key: 'no-clue-after-passing'
    }];
  } else {
    return Game.get({ user: user }).then(function(game) {
      return Round.getCluesLeft(game).then(function(clues_left) {
        if ( clues_left > 0 ) {
          return Round.getClue(game, user).then(function(roundClue) {
            if ( roundClue ) {
              return {
                key: 'clue',
                options: [
                  user.nickname,
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
        return game.players.map(function(player) {
          return _.assign({
            user: player,
          }, message);
        });
      }).then(function(messages) {
        return game.players.map(function(player) {
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
        //}).filter(function(el) { return el; }).concat(messages);
        }).filter((el) => el).concat(messages);
      });
    });
  }
};

