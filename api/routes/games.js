'use strict';
const Game = require('models/game');

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
  //{
    //path: '/:game_id',
    //method: 'put',
    //fn: update
  //},
  //{
    //path: '/:game_id',
    //method: 'delete',
    //fn: remove 
  //},
].concat(require('./invites'));

function create(req) {
  return Game.create(req.body);
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
