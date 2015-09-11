var _ = require('lodash');
var Game = require('../../../../models/Game');
var User = require('../../../../models/User');

var setNonRandomGame = function(user) {
  return User.get({ number: user.number }).then(function(user) {
    return Game.get({ user: user }).then(function(game) {
      return Game.update(game, { random: 0 }).then(function() {
        return game;
      });
    });
  });
}

module.exports = setNonRandomGame;
