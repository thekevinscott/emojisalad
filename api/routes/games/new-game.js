'use strict';
const Game = require('models/game');
const Player = require('models/player');
//const Round = require('models/round');
const _ = require('lodash');
const rule = require('config/rule');

module.exports = function(player, input, game_number) {
  if ( rule('new-game').test(input) ) {
    return Player.getGames(player).then(function(games) {
      if ( games.length < player.maximum_games) {
        return Game.create().then(function(game) {
          return Game.add(game, [_.assign({ initial_state: 'waiting-for-invites' }, player)]);
        }).then(function(participants) {
          // we expect an array of participants,
          // even though that array should only have
          // one element.
          let participant = participants[0];
          return [{
            player: player,
            key: 'new-game',
            from: participant.game_number,
            options: [
              player.nickname
            ]
          }];
        });
      } else {
        return [{
          player: player,
          key: 'error-maximum-games',
          from: game_number
        }];
      }
    });
  }
};
