'use strict';
//const setup = require('../lib/setup');
//const startGame = require('./startGame');
const playGame = require('./playGame');
const newGame = require('./newGame');
const sequence = require('../lib/sequence');
//const Round = require('../../../models/Round');

function playGames(players, numberOfGames, options) {
  if ( ! options ) { options = {}; }
  return playGame(players, options).then(function(game) {
    numberOfGames -= 1;
    if ( numberOfGames > 0) {
      return sequence(Array.from({ length: numberOfGames }).map(function() {
        return function() {
          return newGame(players);
        };
      })).then(function(games) {
        games.unshift(game);
        return games;
      });
    } else {
      return [game];
    }
  });
}

module.exports = playGames;
