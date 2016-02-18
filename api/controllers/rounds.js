'use strict';
const Round = require('models/round');
const _ = require('lodash');

module.exports = [
  {
    path: '/',
    method: 'get',
    fn: find 
  },
  {
    path: '/:round_id',
    method: 'put',
    fn: update 
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

function update(req) {
  const game_id = req.params.game_id;
  if ( game_id && !parseInt(game_id) ) {
    throw "Invalid game ID provided";
  }

  const round_id = req.params.round_id;
  if ( ! round_id ) {
    throw "No round ID provided, how is that possible?";
  } else if ( !parseInt(round_id) ) {
    throw "Invalid round ID provided";
  }

  return Round.update({ game_id: game_id, id: round_id }, req.body);
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

module.exports.update = {
  path: '/:game_id/rounds/:round_id',
  method: 'put',
  fn: update
};
