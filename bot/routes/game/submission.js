'use strict';
//const Promise = require('bluebird');
//const Player = require('models/player');
//const Game = require('models/game');
const Round = require('models/round');
const _ = require('lodash');
//const rule = require('config/rule');

module.exports = (game, submitter, input) => {
  return Round.update(game.round, {
    submission: input
  }).then((round) => {
    if ( round && round.id ) {
      const messages = [
        {
          key: 'game-submission-sent',
          player: submitter
        }
      ];

      return messages.concat(round.players.map((player) => {
        const message = {
          player
        };
        return [
          _.assign({
            key: 'emojis',
            options: [submitter.nickname, submitter.avatar, input]
          }, message),
          _.assign({
            key: 'guessing-instructions'
          }, message)
        ];
      })).reduce((a, b) => {
        return a.concat(b);
      }, []);
    } else {
      console.error('round', round, game);
      throw "Round was not updated";
    }
  });
};
