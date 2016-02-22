'use strict';
const Promise = require('bluebird');
//const Player = require('models/player');
const Game = require('models/game');
const Round = require('models/round');
const Emoji = require('models/emoji');
const _ = require('lodash');
const rule = require('config/rule');

module.exports = (player, message) => {
  if ( rule('invite').test(message) ) {
    return require('./invite')(player, message);
  } else if ( rule('clue').test(message) ) {
    return require('./clue')(player, message);
  } else if ( rule('new-game').test(message) ) {
    return require('./new_game')(player, message);
  } else if ( rule('help').test(message) ) {
    return require('./help')(player, message);
  } else {
    return Game.get({ player_id: player.id }).then((games) => {
      const game = games[0];

      // TODO: CHange htis
      // if you are the submitter, go to submission below
      // if you are a guesser, go to guess
      // Don't rely on presence of submission
      // Add tests:
      // - guesser should be able to guess without a submission
      if ( game.round ) {
        if ( player.id !== game.round.submitter.id ) {
          return require('./guess')(game, player, message);
        } else {
          if ( ! game.round.submission ) {
            // listen for an emoji submission
            return Emoji.checkInput(message).then((result) => {
              if ( result.type === 'emoji' || result.type === 'mixed' ) {
                return require('./submission')(game, player, message);
              } else {
                return require('./say')(game, player, message);
              }
            });
          } else {
            return require('./say')(game, player, message);
          }
        }
      } else {
        return [{
          player: player,
          key: 'invited-chilling'
        }];
      }
    });
  }
};
