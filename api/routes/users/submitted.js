'use strict';
const Promise = require('bluebird');
const _ = require('lodash');
const Game = require('models/game');
const rule = require('config/rule');

module.exports = function(user, input) {
  if ( rule('invite').test(input) ) {
    return require('../users/invite')(user, input);
  } else if ( rule('help').test(input) ) {
    return require('../users/help')(user, input);
  } else if ( rule('pass').test(input) ) {
    return require('../games/pass')(user, input);
  } else if ( /^clue/i.test(input) ) {
    return Game.get({ user: user }).then(function(game) {
      var message = {
        key: 'says',
        options: [
          user.nickname,
          input
        ]
      };
      var messages = game.players.map(function(player) {
        if ( player.id !== user.id ) {
          return _.assign({
            user: player
          },
          message);
        }
      }).filter((el) => el);

      messages = messages.concat(game.players.map(function(player) {
        return {
          user: player,
          key: 'no-clue-for-submitter'
        };
      }));
      return messages;
    });
        
  } else {
    return Promise.join(
      Game.get({ user: user }),
      function(game) {
        
        var message = {
          key: 'says',
          options: [
            user.nickname,
            input
          ]
        };
        var messages = game.players.map(function(player) {
          if ( player.id !== user.id ) {
            return _.assign({
              user: player
            },
            message);
          }
        }).filter((el) => el);

        // check that the submitter has not just guessed their own clue
        var regex = new RegExp(game.round.phrase, 'i');
        if ( regex.test(input) ) {
          messages = messages.concat(game.players.map(function(player) {
            return {
              key: 'submitter-dont-guess',
              user: player,
              options: [
                user.nickname
              ]
            };
          }));
        }

        return messages;

      }
    );
  }
};

