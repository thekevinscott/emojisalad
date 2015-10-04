'use strict';
var Game = require('models/Game');
var User = require('models/User');

var getGame = function(user) {
  return User.get({ number: user.number }).then(function(user) {
    console.log('user', user.id, user.nickname);
    return Game.get({ user: user });
  });
};

module.exports = getGame;
