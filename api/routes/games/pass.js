'use strict';
let Player = require('../../models/player');
//let Message = require('../../models/message');
const Game = require('models/game');
//const Round = require('models/round');
const _ = require('lodash');

module.exports = function(player, input, game_number) {
  let result;

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

      let players_left = game.round.players.filter(function(game_player) {
        return game_player.id !== player.id && game_player.state === 'guessing';
      });

      let promise;

      if ( players_left.length === 0 ) {
        promise = Game.newRound(game).then(function(round) {
          let suggestion = {
            key: 'game-next-round-suggestion',
            options: [
              round.submitter.nickname,
              round.phrase
            ]
          };

          let nextRoundInstructions = {
            key: 'game-next-round',
            options: [
              round.submitter.nickname,
            ]
          };

          return round.game.players.map(function(game_player) {
            return {
              player: game_player,
              key: 'round-over'
            };
          }).concat(round.game.players.map(function(game_player) {
            if ( game_player.id !== round.submitter.id ) {
              return _.assign( { player: game_player }, nextRoundInstructions);
            } else {
              return _.assign( { player: game_player }, suggestion);
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
        return game.players.map(function(game_player) {
          if ( game_player.id === player.id ) {
            return {
              player: game_player,
              key: 'pass',
              options: [player.nickname]
            };
          } else {
            return {
              player: game_player,
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

