'use strict';
const squel = require('squel');
const Promise = require('bluebird');
const db = require('db');
const passport = require('passport');
const fetch = require('../../fetch');

function getGames() {
  const query = squel.select().from('games');
  return db.query(query).then(result => result.length);
}

function getUsers() {
  const query = squel.select().from('users');
  return db.query(query).then(result => result.length);
}

function getRounds() {
  const query = squel.select().from('rounds').where('created > DATE( DATE_SUB( NOW() , INTERVAL 1 DAY ) )');
  return db.query(query).then(result => result.length);
}

function getAveragePlayersInGame() {
  const query = squel.select().from('players', 'p').left_join('games', 'g', 'g.id=p.game_id');
  return db.query(query).then(result => {
    const games_obj = result.reduce((obj, player) => {
      if ( !obj[player.game_id] ) { obj[player.game_id] = []; }
      obj[player.game_id].push(player);
      return obj;
    }, {});

    const games = Object.keys(games_obj).map(game_id => {
      return games_obj[game_id];
    }).filter(game => game.length > 1);

    const total_players = games.reduce((total, game) => {
      return total + game.length;
    }, 0);

    return Math.round(total_players / games.length * 100) / 100;
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
