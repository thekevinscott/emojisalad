'use strict';
const _ = require('lodash');
const getRandomPhone = require('./getRandomPhone');
const game_numbers = [
  '+15551111111',
  '+15552222222',
  '+15553333333',
  '+15554444444',
  '+15559999999',
];
const EMOJI = '🐳';

// if a number is the argument, this is the number of players
// to create.
//
// if an array is the argument, this is intended to stand
// in as the players we wish to create. fill in the missing
// fields

let listOfNicknames = [
  'Ari',
  'Kevin',
  'SCHLOOOOO',
  'Dave'
];

function getPlayers(arg) {
  let players = [];
  if ( _.isNumber(arg) ) {
    for ( let i=0;i<arg;i++ ) {
      let number = getRandomPhone();
      players.push({
        number: number,
        from: number,
        nickname: listOfNicknames[i]+Math.random(),
        to: game_numbers[0],
        avatar: EMOJI
      });
    }
  } else if ( _.isArray(arg) ) { 
    let nicknameCount = 0;
    players = arg;
    players.map(function(player) {
      if ( ! player.phone ) {
        player.phone = getRandomPhone();
      }
      if ( ! player.nickname ) {
        player.nickname = listOfNicknames[nicknameCount++]+Math.random();
      }
      if ( ! player.avatar ) {
        player.avatar = EMOJI;
      }
    });
  }
  return players;
}

module.exports = getPlayers;
