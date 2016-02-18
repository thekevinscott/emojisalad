'use strict';
const Round = require('models/round');
const _ = require('lodash');

module.exports = [
  {
    path: '/',
    method: 'get',
    fn: find 
  },
];

function create(req) {
  const game_id = req.params.game_id;
  if ( ! game_id ) {
    throw "No game ID provided, how is that possible?";
  } else if ( !parseInt(game_id) ) {
    throw "Invalid game ID provided";
  }

  return Round.create({ id: game_id });
}
function findByGameID(req) {
  const game_id = req.params.game_id;
  if ( ! game_id ) {
    throw "No game ID provided, how is that possible?";
  } else if ( !parseInt(game_id) ) {
    throw "Invalid game ID provided";
  }

  let query = req.query;
  query.game_id = game_id;

  return Round.find(query);
}
function find(req) {
  return Round.find(req.query);
}

module.exports.find = {
  path: '/:game_id/rounds',
  method: 'get',
  fn: findByGameID 
};

module.exports.create = {
  path: '/:game_id/rounds',
  method: 'post',
  fn: create 
};
