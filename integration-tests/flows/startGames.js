'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const services = require('config/services');
const port = services.api.port;
const sequence = require('../lib/sequence');
const startGame = require('flows/startGame');
const newGame = require('flows/newGame');
//const services = require('config/services');
//const port = services.api.port;
//const _ = require('lodash');

const getAssociatedPlayers = (player) => {
  const url = `http://localhost:${port}/players`;
  return request({
    url,
    method: 'get',
    qs: {
      from: player.from
    }
  }).then((res) => {
    return JSON.parse(res.body);
  });
};

const aGameIsMissingRoundCount = games => {
  return games.map(game => {
    return game.round_count;
  }).filter(count => count === 0).length;
};

const gamesAreMissingPlayers = (games, expected_players) => {
  return games.filter(game => {
    return game.players.length !== expected_players.length;
  }).length;
};

const getAssociatedGames = (requested_player, expected_players) => {
  return getAssociatedPlayers(requested_player).then((players) => {
    const player_ids = players.map((player) => {
      return player.id;
    });

    const url = `http://localhost:${port}/games`;
    return request({
      url,
      method: 'get',
      qs: {
        player_ids
      }
    }).then((res) => {
      return JSON.parse(res.body);
    }).then(games => {
      if (aGameIsMissingRoundCount(games) || gamesAreMissingPlayers(games, expected_players)) {
        // game hasn't been handled yet
        return getAssociatedGames(requested_player, expected_players);
      }

      return games;
    });
  });
};

const startGames = (players, number_of_games, options) => {
  if ( ! options ) { options = {}; }

  return startGame(players, options).then(() => {
    number_of_games -= 1;
    if ( number_of_games > 0) {
      return sequence(Array.from({ length: number_of_games }).map(() => {
        return () => {
          return newGame(players, null, 1);
        };
      }));
    }
  }).then(() => {
    return getAssociatedGames(players[0], players);
  });
};

module.exports = startGames;

