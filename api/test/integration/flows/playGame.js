'use strict';
const setup = require('../lib/setup');
const startGame = require('./startGame');
const Round = require('../../../models/Round');
const rule = require('../../../config/rule');

// submit any old emoji to start a round
const EMOJI = '😀';
const submission = rule('submission').example();

function playGame(users, options) {
  if ( ! options ) { options = {}; }
  return startGame(users).then(function(game) {
    return setup([
      {
        user: users[0],
        msg: submission + EMOJI 
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
