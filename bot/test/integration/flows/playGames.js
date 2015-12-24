'use strict';
const Promise = require('bluebird');
//const setup = require('../lib/setup');
//const startGame = require('./startGame');
const playGame = require('./playGame');
const newGame = require('./newGame');
const sequence = require('../lib/sequence');
//const Round = require('../../../models/Round');

let playGames = Promise.coroutine(function* (players, numberOfGames, options) {
  if ( ! options ) { options = {}; }

  let game = yield playGame(players, options);

  numberOfGames -= 1;
  if ( numberOfGames > 0) {
    let games = yield sequence(Array.from({ length: numberOfGames }).map(function() {
      return function() {
        return newGame(players);
      };
    }));

    games.unshift(game);
    return games;
  } else {
    return [game];
  }
});

module.exports = playGames;
