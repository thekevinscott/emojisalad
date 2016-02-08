'use strict';
//const Game = require('models/Game');
const Player = require('models/Player');
const game_numbers = require('../../../../config/numbers');

function getGame(player, debug) {
  if ( ! player.id ) {
    return Player.get({ number: player.number, to: player.to }).then(function(player) {
      return Game.get({ player: player, game_number: game_numbers.getDefault() }, debug);
    });
  } else {
    return Game.get({ player: player, game_number: game_numbers.getDefault() }, debug);
  }
}

module.exports = getGame;
