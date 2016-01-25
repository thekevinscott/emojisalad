'use strict';
const Promise = require('bluebird');
const Player = require('models/player');
const User = require('models/user');
//var Message = require('../../models/message');

module.exports = Promise.coroutine(function* (params, input, to) {
  if ( params.user ) {
    return require('../games/new-game')(params, input, to);
  } else {
    return User.create({ from: params.from }).then((user) => {
      //console.log('*** TECHNICALLY, we shouldnt create a player until the game begins');
      return Player.create({ from: params.from, to: to });
    }).then((player) => {
      return [{
        key: 'intro',
        player: player
      }];
    });
  }
});
