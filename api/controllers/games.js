'use strict';
const Game = require('models/game');
const _ = require('lodash');

const invites = require('./invites');

module.exports = [
  {
    path: '/',
    method: 'get',
    fn: find 
  },
  {
    path: '/',
    method: 'post',
    fn: create
  },
  {
    path: '/:game_id',
    method: 'get',
    fn: findOne
  },
  {
    path: '/:game_id/players',
    method: 'post',
    fn: add
  },
  //{
    //path: '/:game_id',
    //method: 'delete',
    //fn: remove 
  //},
].concat([
  invites.create,
  invites.use,
  invites.find,
]);

function create(req) {
  const users = req.body.users;
  //console.log('users', req.body);
  if ( ! users || !_.isArray(users) ) {
    console.log('no dice, kids 3');
    throw "You must provide an array of users";
  }
  return Game.create(users);
}
function find(req) {
  return Game.find(req.query);
}
function findOne(req) {
  const game_id = req.params.game_id;
  if ( ! game_id ) {
    throw "No game ID provided, how is that possible?";
  } else if ( !parseInt(game_id) ) {
    throw "Invalid game ID provided";
  }
  return Game.findOne(game_id);
}
function add(req) {
  const game_id = req.params.game_id;
  if ( ! game_id ) {
    throw "No game ID provided, how is that possible?";
  } else if ( !parseInt(game_id) ) {
    throw "Invalid game ID provided";
  }
  const users = req.body.users;
  //console.log('users', req.body);
  if ( ! users || !_.isArray(users) ) {
    console.log('no dice, kids 2');
    throw "You must provide an array of users";
  }
  return Game.add(game_id, users);
}
//function update(req) {
  //return Player.update({ id: req.params.player_id }, req.body);
//}
//function remove(req) {
  //const player_id = req.params.player_id;
  //if ( ! player_id ) {
    //throw "No player ID provided, how is that possible?";
  //} else if ( !parseInt(player_id) ) {
    //throw "Invalid player ID provided";
  //}
  //return Player.remove(player_id);
//}
