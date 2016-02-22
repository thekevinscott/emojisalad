'use strict';
const Promise = require('bluebird');
//const Player = require('models/player');
const _ = require('lodash');
const rule = require('config/rule');
const Game = require('models/game');

module.exports = (player, input) => {
  return new Promise((resolve) => {
    if ( player.user.games < player.user.maximum_games ) {
      return Game.create([user]).then((game) => {
        const new_player = game.players.filter((game_player) => {
          return game_player.user_id === user.id;
        }).pop();

        resolve([{
          player: new_player,
          key: 'new-game',
          //from: participant.game_number,
          options: [
            new_player.nickname,
            new_player.avatar
          ]
        }]);
      });
    } else {
      resolve([{
        player: player,
        key: 'error-maximum-games',
      }]);
    }
  });
};
