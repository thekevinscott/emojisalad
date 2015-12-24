'use strict';
const setup = require('../lib/setup');
const startGame = require('./startGame');
const Round = require('../../../models/Round');

// submit any old emoji to start a round
const EMOJI = '😀';

function playGame(players, options) {
  if ( ! options ) { options = {}; }
  return startGame(players).then(function(game) {
    return setup([
      {
        player: players[0],
        msg: EMOJI 
      }
    ]).then(function() {
      if ( options.clues_allowed ) {
        return Round.update(game.round, {
          clues_allowed: options.clues_allowed
        });
      }
    }).then(function() {
      return game;
    });
  });
}

module.exports = playGame;
