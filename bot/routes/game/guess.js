'use strict';
const Promise = require('bluebird');
//const Player = require('models/player');
const Game = require('models/game');
const Round = require('models/round');
const _ = require('lodash');
const rule = require('config/rule');
const new_round = require('./new_round');

module.exports = (game, player, input) => {
  const original_phrase = game.round.phrase;
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
          console.info('roudn', round);
          // correct guess!
          //return messages.concat(game.round.players.map((game_player) => {
          return messages.concat(game.players.map((game_player) => {
            return {
              player: game_player,
              key: 'correct-guess',
              options: [player.nickname, player.avatar, original_phrase],
            };
          })).concat(new_round(game, round));
        });
      } else {
        // else, incorrect guess
        return messages;
      }
    });
  });
};
