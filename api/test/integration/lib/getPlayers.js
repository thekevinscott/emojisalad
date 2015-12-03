'use strict';
const _ = require('lodash');
const getRandomPhone = require('./getRandomPhone');
const game_numbers = require('../../../../config/numbers');

// if a number is the argument, this is the number of players
// to create.
//
// if an array is the argument, this is intended to stand
// in as the players we wish to create. fill in the missing
// fields

var listOfNicknames = [
  'Ari',
  'Kevin',
  'SCHLOOOOO',
  'Dave'
];

function getPlayers(arg) {
  var players = [];
  if ( _.isNumber(arg) ) {
    for ( var i=0;i<arg;i++ ) {
      let number = getRandomPhone();
      players.push({
        number: number,
        from: number,
        nickname: listOfNicknames[i]+Math.random(),
        to: game_numbers.getDefault()
      });
    }
  } else if ( _.isArray(arg) ) { 
    var nicknameCount = 0;
    players = arg;
    players.map(function(player) {
      if ( ! player.phone ) {
        player.phone = getRandomPhone();
      }
      if ( ! player.nickname ) {
        player.nickname = listOfNicknames[nicknameCount++]+Math.random();
      }
    });
  }
  return players;
}

module.exports = getPlayers;
