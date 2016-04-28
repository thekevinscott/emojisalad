'use strict';
const Promise = require('bluebird');
//const Player = require('models/player');
const _ = require('lodash');
const rule = require('config/rule');
const Round = require('models/round');
const newRound = require('./new_round');
const Game = require('models/game');

module.exports = (game, player, input) => {
  return require('./say')(game, player, input).then((messages) => {
    return Round.create(game).then((round) => {
      return messages.concat(game.players.map((game_player) => {
        return {
          player: game_player,
          key: 'pass',
          options: [player.nickname, player.avatar, input]
        };
      })).concat(newRound(game, round));
    });
  });
};
