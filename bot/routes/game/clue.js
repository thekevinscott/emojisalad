'use strict';
const Promise = require('bluebird');
//const Player = require('models/player');
const _ = require('lodash');
const rule = require('config/rule');
const Game = require('models/game');

module.exports = (player, input) => {
  return Game.get({ player_id: player.id }).then((games) => {
    const game = games[0];

    return require('./say')(game, player, input).then((messages) => {
      return messages.concat(game.players.map((game_player) => {
        return {
          player: game_player,
          key: 'clue',
          options: [
            player.nickname,
            player.avatar,
            game.round.clue
          ]
        };
      }));
    });
  });
};
