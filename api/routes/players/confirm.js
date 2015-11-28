'use strict';
var Player = require('models/player');
var rule = require('config/rule');
//var Message = require('../../models/message');

module.exports = function(player, input) {
  if ( rule('yes').test(input) ) {
    return Player.update(player, {
      state: 'waiting-for-nickname'
    }).then(function() {
      return [{
        key: 'intro_2',
        player: player
      }];
    });
  } else {
    Player.update(player, {
      blacklist: 1
    });
  }
};
