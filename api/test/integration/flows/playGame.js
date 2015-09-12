var _ = require('lodash');
var Promise = require('bluebird');
var setup = require('../lib/setup');
var startGame = require('./startGame');
var Round = require('../../../models/Round');

// submit any old emoji to start a round
var EMOJI = '😀';

function playGame(users, options) {
  if ( ! options ) { options = {}; }
  return startGame(users).then(function(game) {
    return setup([
      {
        user: users[0],
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
