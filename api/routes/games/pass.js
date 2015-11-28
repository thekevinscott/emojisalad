'use strict';
var Player = require('../../models/player');
//var Message = require('../../models/message');
const Game = require('models/game');
//const Round = require('models/round');
const _ = require('lodash');

module.exports = function(player, input, game_number) {
  var result;

  if ( player.state === 'ready-for-game' || player.state === 'waiting-for-round' ) {
    result = 'pass-rejected-not-playing';
  } else if ( player.state === 'lost' ) {
    result = 'no-pass-after-loss';
  } else if ( player.state === 'waiting-for-submission' ) {
    result = 'pass-rejected-need-a-guess';
  } else if ( player.state === 'submitted' ) {
    result = 'pass-rejected-not-guessing';
  } else if ( player.state === 'guessing' ) {
    result = Game.get({ player: player, game_number: game_number }).then(function(game){
      return Player.update(player, { state: 'passed' }).then(function() {
        return game;
      });
    }).then(function(game) {
      Game.updateScore(game, player, 'pass');

      var players_left = game.round.players.filter(function(player) {
        return player.id !== player.id && player.state === 'guessing';
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
              player: player,
              key: 'round-over'
            };
          }).concat(round.game.players.map(function(player) {
            if ( player.id !== round.submitter.id ) {
              return _.assign( { player: player }, nextRoundInstructions);
            } else {
              return _.assign( { player: player }, suggestion);
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
          if ( player.id === player.id ) {
            return {
              player: player,
              key: 'pass',
              options: [player.nickname]
            };
          } else {
            return {
              player: player,
              key: 'player-passed',
              options: [player.nickname]
            };
          }
        }).concat(endingMessages);
      });

    });
  }

  if ( typeof result === 'string' ) {
    return [{
      player: player,
      key: result 
    }];
  } else {
    return result;
  }
};

