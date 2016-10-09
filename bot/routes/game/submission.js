'use strict';
const Round = require('models/round');
const _ = require('lodash');
//const setTimer = require('lib/setTimer');
const Timer = require('models/timer');

module.exports = (game, submitter, input) => {
  //setTimer.clear(game, 'submission');
  Timer.clear('submission', game.id);
  Timer.clear('submission-2', game.id);
  //Timer.clear('submission-timeout', game.id);
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

      const one_day = 24 * 60 * 60;

      const nudge_messages = game.players.map((game_player) => {
        return {
          player: game_player,
          key: 'cron-waiting-to-begin-guessing',
          options: {
            avatar: game.round.submitter.avatar,
            nickname: game.round.submitter.nickname,
            submission: input,
          },
          protocol: game_player.protocol,
        };
      }).filter(message => message);
      const nudge_messages_2 = game.players.map((game_player) => {
        return {
          player: game_player,
          key: 'cron-waiting-to-begin-guessing-2',
          options: {
            avatar: game.round.submitter.avatar,
            nickname: game.round.submitter.nickname,
            submission: input,
          },
          protocol: game_player.protocol
        };
      }).filter(message => message);
      Timer.set('nobody-has-guessed', game.id, nudge_messages, 1 * one_day);
      Timer.set('nobody-has-guessed-2', game.id, nudge_messages_2, 2 * one_day);

      return messages.concat(round.players.map((player) => {
        const message = {
          player
        };
        return [
          _.assign({
            key: 'emojis',
            options: [submitter.nickname, submitter.avatar, input]
          }, message),
        ];
      })).concat(round.players.map(player => {
        const message = {
          player
        };
        return [
          _.assign({
            key: 'guessing-instructions'
          }, message)
        ];
      })).reduce((a, b) => {
        return a.concat(b);
      }, []);
    } else {
      console.error('round', round, game);
      throw new Error("Round was not updated");
    }
  });
};
