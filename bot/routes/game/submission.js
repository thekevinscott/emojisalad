'use strict';
const Promise = require('bluebird');
//const Player = require('models/player');
const Game = require('models/game');
const Round = require('models/round');
const _ = require('lodash');
const rule = require('config/rule');

module.exports = (game, submitter, input) => {
  return Round.update(game.round, {
    submission: input
  }).then((round) => {
    if ( round && round.id ) {
      let messages = [
        {
          key: 'game-submission-sent',
          player: submitter
        }
      ];

      return messages.concat(round.players.map((player) => {
        const message = {
          player: player
        };
        return [
          _.assign({
            key: 'emojis',
            options: [submitter.nickname, submitter.avatar, input],
          }, message),
          _.assign({
            key: 'guessing-instructions',
          }, message),
        ];
      })).reduce((a, b) => {
        return a.concat(b);
      }, []);
      //{ key: 'game-submission-sent', to: players[0] },
      //{ key: 'emojis', options: [players[0].nickname, players[0].avatar, EMOJI], to: players[1] },
      //{ key: 'emojis', options: [players[0].nickname, players[0].avatar, EMOJI], to: players[2] },
      //{ key: 'guessing-instructions', to: players[1] },
      //{ key: 'guessing-instructions', to: players[2] }
      
    } else {
      throw "Round was not updated";
    }
  });
};
