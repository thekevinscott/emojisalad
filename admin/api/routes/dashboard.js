'use strict';
const squel = require('squel');
const Promise = require('bluebird');
const db = require('db');
const passport = require('passport');
const fetch = require('../../fetch');

function getGames() {
  return fetch('games', 'get').then(result => result.length);
}
function getUsers() {
  return fetch('users', 'get').then(result => result.length);
}
function getRounds() {
  return fetch('rounds', 'get').then(result => result.length);
}
function getAveragePlayersInGame() {
  return fetch('games', 'get').then(result => {
    const games = result.filter(game => game.players > 1);
    const total_number_of_players = games.reduce((total, game) => {
      return total + game.players.length;
    }, 0);
    return (total_number_of_players / games.length || 0).toFixed(2);
  });
}

module.exports = function(app) {
  app.get('/api/dashboard', function(req, res) {
    const fns = {
      games: getGames,
      users: getUsers,
      rounds: getRounds,
      average_players_in_game: getAveragePlayersInGame
    };
    Promise.all(Object.keys(fns).map(key => {
      return fns[key]().then(result => ({
        key,
        result
      }));
    })).then(results => {
      res.json(results.reduce((obj, el) => {
        return Object.assign({}, obj, {
          [el.key]: el.result
        });
      }, {}));
    }).catch(function(err) {
      res.json({error: err});
    });
  });
};
