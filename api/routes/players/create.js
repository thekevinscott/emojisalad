'use strict';
//var Promise = require('bluebird');
var Player = require('models/player');
//var Message = require('../../models/message');

module.exports = function(player) {
  return Player.create({ number: player.number }).then(function(player) {
    return [{
      key: 'intro',
      player: player
    }];
  });
};
