const Promise = require('bluebird');
const _ = require('lodash');
const rule = require('config/rule');
const Game = require('models/game');

module.exports = (player, input) => {
  return Game.get({ player_id: player.id }).then((games) => {
    const game = games[0];

    console.info('help: game', game.round);
    if ( game.round.submitter.id === player.id ) {
      // this is the submitter
      if ( !game.round.submission ) {
        // they are asking how to submit a submission
        return [{
          player,
          key: 'help-submitter-waiting-for-submission',
          options: { game }
        }];
      } else {
        // they are asking what to do now that they've submitted
        return [{
          player,
          key: 'help-submitter-submitted',
          options: { game }
        }];
      }
    } else if (game.round) {
      // a player is asking for help
      if ( game.round.submission ) {
        // a player is asking what to do before the submission
        // has been delivered. soothe their aching souls.
        return [{
          player,
          key: 'help-player-guessing',
          options: { game }
        }];
      } else {
        // a player is asking how to play an active round
        return [{
          player,
          key: 'help-player-ready-for-game',
          options: { game }
        }];
      }
    } else {
      // no game round exists; this is probably a result
      // of fucking around directly with the database
      throw new Error(`No round exists for: ${game.key}`);
    }
  });
};
