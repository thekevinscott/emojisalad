'use strict';
var Game = require('models/Game');
var User = require('models/User');

var getGame = function(user) {
  return User.get({ number: user.number }).then(function(user) {
    return Game.get({ user: user, game_number: '12013409832' });
  });
};

module.exports = getGame;
