var _ = require('lodash');
var Promise = require('bluebird');
var setup = require('../lib/setup');
var startGame = require('./startGame');

// submit any old emoji to start a round
var EMOJI = '😀';

function playGame(users) {
  return startGame(users).then(function() {
    return setup([
      {
      user: users[0],
      msg: EMOJI 
    }
    ]);
  });
}

module.exports = playGame;
