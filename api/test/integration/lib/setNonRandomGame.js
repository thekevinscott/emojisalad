'use strict';
var getGame = require('./getGame');
var Game = require('models/Game');

var setNonRandomGame = function(user) {
  return getGame(user).then(function(game) {
    if ( !game ) {
      throw "No game found for user " + user.nickname;
    }
    return Game.update(game, { random: 0 }).then(function() {
      return game;
    });
  });
};

module.exports = setNonRandomGame;
