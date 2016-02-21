'use strict';
const Promise = require('bluebird');
//const Player = require('models/player');
const Game = require('models/game');
const _ = require('lodash');
const rule = require('config/rule');

module.exports = (game, player, input) => {
  return new Promise((resolve) => {
    const message = {
      key: 'says',
      options: [
        player.nickname,
        player.avatar,
        input 
      ]
    };

    resolve(game.players.map((game_player) => {
      if ( game_player.id !== player.id ) {
        return _.assign({
          //number: player.number,
          player: game_player
        },
        message);
      }
    }).filter((el) => el));
  });
};
