'use strict';
var Game = require('models/Game');
var Player = require('models/Player');

var getGame = function(player) {
  return Player.get({ number: player.number }).then(function(player) {
    return Game.get({ player: player, game_number: '12013409832' });
  });
};

module.exports = getGame;
