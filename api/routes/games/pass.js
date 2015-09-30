'use strict';
var User = require('../../models/user');
//var Message = require('../../models/message');
const Game = require('models/game');
//const Round = require('models/round');
const _ = require('lodash');

module.exports = function(user) {
  var result;

  if ( user.state === 'ready-for-game' || user.state === 'waiting-for-round' ) {
    result = 'pass-rejected-not-playing';
  } else if ( user.state === 'lost' ) {
    result = 'no-pass-after-loss';
  } else if ( user.state === 'waiting-for-submission' ) {
    result = 'pass-rejected-need-a-guess';
  } else if ( user.state === 'submitted' ) {
    result = 'pass-rejected-not-guessing';
  } else if ( user.state === 'guessing' ) {
    result = Game.get({ user: user }).then(function(game){
      Game.updateScore(game, user, 'pass');

      var players_left = game.round.players.filter(function(player) {
        return player !== user && player.state === 'guessing';
      });

      var promise;

      if ( players_left.length === 0 ) {
        promise = Game.newRound(game).then(function(round) {
          var suggestion = {
            key: 'game-next-round-suggestion',
            options: [
              round.submitter.nickname,
              round.phrase
            ]
          };

          var nextRoundInstructions = {
            key: 'game-next-round',
            options: [
              round.submitter.nickname,
            ]
          };

          return round.game.players.map(function(player) {
            return {
              user: player,
              key: 'round-over'
            };
          }).concat(round.game.players.map(function(player) {
            if ( player.id !== round.submitter.id ) {
              return _.assign( { user: player }, nextRoundInstructions);
            } else {
              return _.assign( { user: player }, suggestion);
            }
          }));
        });
      } else {
        promise = new Promise(function(resolve) {
          // no ending messages
          resolve([]);
        });
      }

      return promise.then(function(endingMessages) {
        return game.players.map(function(player) {
          if ( player.id === user.id ) {
            return {
              user: player,
              key: 'pass',
              options: [user.nickname]
            };
          } else {
            return {
              user: player,
              key: 'user-passed',
              options: [user.nickname]
            };
          }
        }).concat(endingMessages);
      });

    });
  }

  User.update(user, { state: 'passed' });

  if ( typeof result === 'string' ) {
    return [{
      user: user,
      key: result 
    }];
  } else {
    return result;
  }
};

