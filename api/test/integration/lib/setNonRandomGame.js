'use strict';
const getGame = require('./getGame');
const Game = require('models/Game');
const Promise = require('bluebird');

let setNonRandomGame = Promise.coroutine(function* (player) {
  let game = yield getGame(player, true);
  if ( ! game || ! game.id ) {
    console.error('player', player);
    console.error('game', game);
    throw "There is no game ID";
  }
  yield Game.update(game, { random: 0 });
  return game;
});

module.exports = setNonRandomGame;
