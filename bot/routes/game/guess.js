'use strict';
const Promise = require('bluebird');
//const Player = require('models/player');
const Game = require('models/game');
const Round = require('models/round');
const _ = require('lodash');
const rule = require('config/rule');

module.exports = (game, player, input) => {
  // game is in progress
  return Round.guess(game.round, {
    guess: input,
    player_id: player.id
  }).then((resulting_round) => {
    if ( resulting_round.error ) {
      throw new Error(resulting_round.error);
    }
    return require('./say')(game, player, input).then((messages) => {
      if ( resulting_round.winner && resulting_round.winner.id ) {
        return Round.create(game).then((round) => {
          // correct guess!
          return messages.concat(game.round.players.map((game_player) => {
            return {
              player: game_player,
              key: 'correct-guess',
              options: [player.nickname, player.avatar, input],
            };
          })).concat(game.players.map((game_player) => {
            const message = {
              player: game_player
            };
            if ( game_player.id === round.submitter.id ) {
              return _.assign({
                key: 'game-next-round-suggestion',
                options: [player.nickname, player.avatar, round.phrase]
              }, message);
            } else {
              return _.assign({
                key: 'game-next-round',
                options: [player.nickname, player.avatar]
              }, message);
            }
            return {
              player: game_player,
              key: 'correct-guess',
              options: [player.nickname, player.avatar, input],
            };
          }));
        });
      } else {
        // else, incorrect guess
        return messages;
      }
    });
  });
};
