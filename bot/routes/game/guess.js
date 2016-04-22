'use strict';
//const Promise = require('bluebird');
//const Player = require('models/player');
//const Message = require('models/message');
const Round = require('models/round');
//const _ = require('lodash');
//const rule = require('config/rule');
const new_round = require('./new_round');
//const sendMessages = require('lib/sendMessages');
const setTimer = require('lib/setTimer');

module.exports = (game, player, input) => {
  setTimer.clear(game);
  const original_phrase = game.round.phrase;
  // game is in progress
  return Round.guess(game.round, {
    guess: input,
    player_id: player.id
  }).then((resulting_round) => {
    if ( resulting_round.error ) {
      console.error('error with new round', resulting_round);
      throw new Error(resulting_round.error);
    }
    console.info('resulting round', resulting_round);
    return require('./say')(game, player, input).then((messages) => {
      if ( resulting_round.winner && resulting_round.winner.id ) {
        return Round.create(game).then((round) => {
          console.info('round', round);
          if ( round.error ) {
            console.error('There was an error creating the round');
          }
          // correct guess!
          //return messages.concat(game.round.players.map((game_player) => {
          return messages.concat(game.players.map((game_player) => {
            return {
              player: game_player,
              key: 'correct-guess',
              options: [player.nickname, player.avatar, original_phrase]
            };
          })).concat(new_round(game, round));
        });
      } else {
        // if a game is in progress, set a timeout to say the guess
        // was incorrect
        if ( resulting_round.submission ) {
          setTimer(game, game.players.map((game_player) => {
            return {
              player: game_player,
              key: 'cron',
              options: [input],
              protocol: 'sms'
            };
          }), 30 * 60 * 1000); // 30 minutes
        }

        // else, incorrect guess
        return messages;
      }
    });
  });
};
