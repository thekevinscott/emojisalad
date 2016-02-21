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
  } else if ( rule('help').test(message) ) {
    return require('./help')(player, message);
  } else {
    return Game.get({ player_id: player.id }).then((games) => {
      const game = games[0];

      if ( game.round.submission ) {
        return require('./guess')(game, player, message);
      } else {
        // listen for an emoji submission
        return Emoji.checkInput(message).then((result) => {
          if ( result.type === 'emoji' || result.type === 'mixed' ) {
            return require('./submission')(game, player, message);
          } else {
            return require('./say')(game, player, message);
          }
        });
      }
    });
  }
};
