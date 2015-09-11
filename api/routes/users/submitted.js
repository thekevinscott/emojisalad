var User = require('../../models/user');
//var Message = require('../../models/message');
var Game = require('../../models/game');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(user, input) {

  if ( /^invite(.*)/i.test(input) ) {
    return require('../users/invite')(user, input);
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
      }).filter(function(el) { return el });

      messages = messages.concat(game.players.map(function(player) {
        return {
          user: player,
          key: 'no-clue-for-submitter'
        }
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
        }).filter(function(el) { return el });

        // check that the submitter has not just guessed their own clue
        var regex = new RegExp(game.round.phrase, 'i');
        console.log('regex', game.round.phrase, regex);
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
}

