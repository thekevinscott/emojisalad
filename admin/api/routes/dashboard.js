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

module.exports = function(app) {
  app.get('/api/dashboard', function(req, res) {
    const fns = {
      games: getGames,
      users: getUsers
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
