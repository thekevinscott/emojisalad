'use strict';
var getGame = require('./getGame');
var Game = require('models/Game');

var setNonRandomGame = function(player) {
  //console.log('in set non random game, player', player);
  return getGame(player).then(function(game) {
    //console.log('game', game);
    return Game.update(game, { random: 0 }).then(function() {
      return game;
    });
  });
};

module.exports = setNonRandomGame;
