'use strict';
const setup = require('lib/setup');
const startGame = require('flows/startGame');

// submit any old emoji to start a round
const EMOJI = '😀';

/**
 *
 * @returns {String} game_phrase - The current round's correct game phrase
 */
const playGame = (players, return_game_phrase = false) => {
  return startGame(players, return_game_phrase).then((game_phrase) => {
    return setup([
      {
        player: players[0],
        msg: EMOJI
      }
    ]).then(() => {
      return game_phrase;
    });
  });
};

module.exports = playGame;
