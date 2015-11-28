'use strict';
//var Promise = require('bluebird');
var Player = require('models/player');
//var Message = require('../../models/message');

module.exports = function(player, input, to) {
  return Player.create({ number: player.number, to: to }).then(function(player) {
    return [{
      key: 'intro',
      player: player
    }];
  });
};
