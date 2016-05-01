'use strict';
const _ = require('lodash');
//const setTimer = require('lib/setTimer');
const Timer = require('models/timer');

const newRound = (game, round) => {
  return game.players.map((game_player) => {
    const message = {
      player: game_player
    };
    if ( ! game_player.id ) {
      console.error('Why is there no game player id', game_player);
    }

    if ( ! round.submitter ) {
      console.error('Why is there no roudn submitter', round);
    }

    if ( game_player.id === round.submitter.id ) {
      const cron_msg = [{
        player: game_player,
        key: 'cron-waiting-for-submission',
        options: [
          round.submitter.nickname,
          round.submitter.avatar,
          round.phrase
        ],
        protocol: game_player.protocol
      }];
      Timer.set('submission', game.id, cron_msg, 24 * 60 * 60);

      return _.assign({
        key: 'game-next-round-suggestion',
        options: [round.submitter.nickname, round.submitter.avatar, round.phrase]
      }, message);
    } else {
      return _.assign({
        key: 'game-next-round',
        options: [round.submitter.nickname, round.submitter.avatar]
      }, message);
    }
  });
};

module.exports = newRound;
