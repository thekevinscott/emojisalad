'use strict';
var getGame = require('./getGame');
var Game = require('models/Game');

var setNonRandomGame = function(player) {
  return getGame(player).then(function(game) {
    return Game.update(game, { random: 0 }).then(function() {
      return game;
    });
  });
};

module.exports = setNonRandomGame;
