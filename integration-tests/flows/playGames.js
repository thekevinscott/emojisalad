'use strict';
//const Promise = require('bluebird');
//const setup = require('../lib/setup');
//const startGame = require('./startGame');
const playGame = require('flows/playGame');
const newGame = require('flows/newGame');
const sequence = require('lib/sequence');
//const Round = require('../../../models/Round');

const playGames = (players, numberOfGames, options) => {
  if ( ! options ) { options = {}; }

  return playGame(players, options).then(() => {
    numberOfGames -= 1;
    if ( numberOfGames > 0) {
      return sequence(Array.from({ length: numberOfGames }).map(() => {
        return () => {
          return newGame(players);
        };
      //})).then((games) => {
        //games.unshift(game);
        //return games;
      //});
      }));
    //} else {
      //return [game];
    }
  });
};

module.exports = playGames;
