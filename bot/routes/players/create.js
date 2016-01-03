'use strict';
var Promise = require('bluebird');
var Player = require('models/player');
var User = require('models/user');
//var Message = require('../../models/message');

module.exports = Promise.coroutine(function* (player_params, input, to) {
  if ( player_params.user ) {
    return require('../games/new-game')(player_params, input, to);
  } else {
    let user = yield User.create({ from: player_params.number });
    let player = yield Player.create({ from: player_params.from, to: to, user: user });
    return [{
      key: 'intro',
      player: player
    }];
  }
});
