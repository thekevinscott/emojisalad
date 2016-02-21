'use strict';
const Promise = require('bluebird');
//const Player = require('models/player');
const _ = require('lodash');
const rule = require('config/rule');
const Game = require('models/game');

module.exports = (player, input) => {
  return Game.get({ player_id: player.id }).then((games) => {
    const game = games[0];

    if ( game.round.submitter.id === player.id ) {
      // this is the submitter
      if ( !game.round.submission ) {
        // they are asking how to submit a submission
        return [{
          player: player,
          key: 'help-submitter-waiting-for-submission',
          options : { game: game }
        }];
      } else {
        // they are asking what to do now that they've submitted
        return [{
          player: player,
          key: 'help-submitter-submitted',
          options : { game: game }
        }];
      }
    } else {
      // a player is asking for help
      if ( game.round.submission ) {
        // a player is asking what to do before the submission
        // has been delivered. soothe their aching souls.
        return [{
          player: player,
          key: 'help-player-ready-for-game',
          options : { game: game }
        }];
      } else {
        // a player is asking how to play an active round
        return [{
          player: player,
          key: 'help-player-ready-for-game',
          options : { game: game }
        }];
      }
    }
  });
};
