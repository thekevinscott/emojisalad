var _ = require('lodash');
var Game = require('../../../models/Game');
var User = require('../../../models/User');

var getGame = function(user) {
  return User.get({ number: user.number }).then(function(user) {
    return Game.get({ user: user });
  });
}

module.exports = getGame;
