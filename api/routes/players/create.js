'use strict';
//var Promise = require('bluebird');
var Player = require('models/player');
var User = require('models/user');
//var Message = require('../../models/message');

module.exports = function(player, input, to) {
  if ( player.user ) {
    //console.log('just cerate a player', player, to);
    return Player.create({ number: player.number, to: to, user: player.user }).then(function(player) {
      return [{
        key: 'intro',
        player: player
      }];
    });
  } else {
    //console.log('create em all', player);

    return User.create({ from: player.number }).then(function(user) {
      return Player.create({ number: player.number, to: to, user: user }).then(function(player) {
        return [{
          key: 'intro',
          player: player
        }];
      });
    });
  }
};
