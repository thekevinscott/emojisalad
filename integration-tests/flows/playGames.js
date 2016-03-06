'use strict';
//const Promise = require('bluebird');
//const request = Promise.promisify(require('request'));
//const services = require('config/services');
//const port = services.api.port;
const setup = require('lib/setup');
//const startGame = require('./startGame');
const startGames = require('flows/startGames');
const sequence = require('lib/sequence');
//const Round = require('../../../models/Round');

// submit any old emoji to start a round
const EMOJI = '😀';

const playGames = (players, number_of_games, options) => {
  if ( ! options ) { options = {}; }

  return startGames(players, number_of_games, options).then((games) => {
    return sequence(games.map((game) => {
      const player = game.players.filter((game_player) => {
        return game_player.from === players[0].from;
      }).pop();

      const msg = {
        player,
        msg: EMOJI,
        get_response: true
      };

      return () => {
        return setup([msg]);
      };
    })).then(() => {
      return games;
    });
  });
};
module.exports = playGames;
