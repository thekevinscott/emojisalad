'use strict';
var User = require('../../models/user');
//var Message = require('../../models/message');
const Game = require('models/game');
//const Round = require('models/round');
//const _ = require('lodash');

module.exports = function(user) {
  var result;

  if ( user.state === 'ready-for-game' ) {
    result = 'pass-rejected-not-playing';
  } else if ( user.state === 'lost' ) {
    result = 'no-pass-after-loss';
  } else if ( user.state === 'waiting-for-submission' ) {
    result = 'pass-rejected-need-a-guess';
  } else if ( user.state === 'submitted' ) {
    result = 'pass-rejected-not-guessing';
  } else if ( user.state === 'guessing' ) {
    result = Game.get({ user: user }).then(function(game){
      return game.players.map(function(player) {
        if ( player.id === user.id ) {
          return {
            user: player,
            key: 'pass',
            options: [user.nickname]
          };
        } else {
          return {
            user: player,
            key: 'user-passed',
            options: [user.nickname]
          };
        }
      });
    });
  //} else {
    //key = 'pass-rejected-not-playing';
  }

  User.update(user, { state: 'passed' });

  if ( typeof result === 'string' ) {
    return [{
      user: user,
      key: result 
    }];
  } else {
    return result;
  }
};

