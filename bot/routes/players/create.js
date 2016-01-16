'use strict';
const Promise = require('bluebird');
const Player = require('models/player');
const User = require('models/user');
//var Message = require('../../models/message');

module.exports = Promise.coroutine(function* (player_params, input, to) {
  if ( player_params.user ) {
    return require('../games/new-game')(player_params, input, to);
  } else {
    let user = yield User.create({ from: player_params.from });
    console.log('*** TECHNICALLY, we shouldnt create a player until the game begins');
    let player = yield Player.create({ from: player_params.from, to: to, user: user });
    return [{
      key: 'intro',
      player: player
    }];
  }
});
