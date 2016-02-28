'use strict';
const Round = require('models/round');
const _ = require('lodash');

const new_round = (game, round) => {
  return game.players.map((game_player) => {
    const message = {
      player: game_player
    };
    if ( game_player.id === round.submitter.id ) {
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
    return {
      player: game_player,
      key: 'correct-guess',
      options: [round.submitter.nickname, round.submitter.avatar, input],
    };
  });
};

module.exports = new_round;
