'use strict';
//var Player = require('../../models/player');
//var Message = require('../../models/message');
const Game = require('models/game');
//const Round = require('models/round');
//const _ = require('lodash');

var keys = {
  'waiting-for-submission': 'help-submitter-waiting-for-submission',
  'submitted': 'help-submitter-submitted',
  'bench': 'help-player-bench',
  'guessing': 'help-player-guessing',
  'waiting-for-round': getGame('help-player-waiting-for-round'),
  'ready-for-game': getGame('help-player-ready-for-game')
};

function getGame(key) {
  return function(player, game_number) {
    return Game.get({ player: player, game_number: game_number }).then(function(game) {
      return [{
        player: player,
        key: key,
        options: [ game.round.submitter.nickname ]
      }];
    });
  };
}

module.exports = function(player, input, game_number) {
  if ( keys[player.state] ) {
    if ( typeof keys[player.state] === 'function' ) {
      return keys[player.state](player, game_number);
    } else {
      return [{
        player: player,
        key: keys[player.state]
      }];
    }
  } else {
    console.error('no help message found for', player.state, player);
  }
};
