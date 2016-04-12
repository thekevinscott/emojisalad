'use strict';
const _ = require('lodash');
const faker = require('faker');
const getRandomPhone = require('./getRandomPhone');

const game_numbers = require('../../testqueue/config/numbers');
const EMOJIS = [
  '🐳',
  '🌟',
  '🍔',
  '🐦',
  '🐃'

];

// if a number is the argument, this is the number of players
// to create.
//
// if an array is the argument, this is intended to stand
// in as the players we wish to create. fill in the missing
// fields

//let listOfNicknames = [
  //'Ari',
  //'Kevin',
  //'SCHLOOOOO',
  //'Dave'
//];

function getPlayers(arg) {
  let players = [];
  if ( _.isNumber(arg) ) {
    for ( let i=0;i<arg;i++ ) {
      const number = getRandomPhone();
      players.push({
        number,
        from: number,
        nickname: faker.name.findName(),
        to: game_numbers[0],
        avatar: getEmojis()
      });
    }
  } else if ( _.isArray(arg) ) {
    //let nicknameCount = 0;
    players = arg;
    players.map((player) => {
      if ( ! player.phone ) {
        player.phone = getRandomPhone();
      }
      if ( ! player.nickname ) {
        //player.nickname = listOfNicknames[nicknameCount++]+Math.random();
        player.nickname = faker.name.findName();
      }
      if ( ! player.avatar ) {
        player.avatar = getEmojis();
      }
    });
  }
  return players;
}

function getEmojis() {
  return EMOJIS[Math.floor(Math.random()*EMOJIS.length)];
}

module.exports = getPlayers;
