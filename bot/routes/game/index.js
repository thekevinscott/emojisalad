'use strict';
const Promise = require('bluebird');
//const Player = require('models/player');
const Game = require('models/game');
const _ = require('lodash');
const rule = require('config/rule');

module.exports = (player, message) => {
  if ( rule('invite').test(message) ) {
    return require('./invite')(player, message);
  } else {
    return Game.get({ player_id: player.id }).then((games) => {
      const game = games[0];

      const message = {
        key: 'says',
        options: [
          player.nickname,
          player.avatar,
          message
        ]
      };

      return game.players.map((game_player) => {
        if ( game_player.id !== player.id ) {
          return _.assign({
            //number: player.number,
            player: game_player
          },
          message);
        }
      }).filter((el) => el);
    });
  }
};
