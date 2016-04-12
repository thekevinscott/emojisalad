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
  {
    path: '/:round_id/guess',
    method: 'post',
    fn: guess
  }
];

function create(req) {
  const game_id = req.params.game_id;
  if ( ! game_id ) {
    throw new Error("No game ID provided, how is that possible?");
  } else if ( !parseInt(game_id) ) {
    throw new Error("Invalid game ID provided");
  }

  return Round.create({ id: game_id });
}
function findByGameID(req) {
  const game_id = req.params.game_id;
  if ( ! game_id ) {
    throw new Error("No game ID provided, how is that possible?");
  } else if ( !parseInt(game_id) ) {
    throw new Error("Invalid game ID provided");
  }

  const query = req.query;
  query.game_id = game_id;

  return Round.find(query);
}

function update(req) {
  const game_id = req.params.game_id;
  if ( game_id && !parseInt(game_id) ) {
    throw new Error("Invalid game ID provided");
  }

  const round_id = req.params.round_id;
  if ( ! round_id ) {
    throw new Error("No round ID provided, how is that possible?");
  } else if ( !parseInt(round_id) ) {
    throw new Error("Invalid round ID provided");
  }

  const params = {
    submission: req.body.submission
  };

  return Round.update({ game_id, id: round_id }, params);
}

function find(req) {
  return Round.find(req.query);
}

function guess(req) {
  const game_id = req.params.game_id;
  if ( game_id && !parseInt(game_id) ) {
    throw new Error("Invalid game ID provided");
  }

  const round_id = req.params.round_id;
  if ( ! round_id ) {
    throw new Error("No round ID provided, how is that possible?");
  } else if ( !parseInt(round_id) ) {
    throw new Error("Invalid round ID provided");
  }

  const guess = req.body.guess;

  if ( ! guess ) {
    throw new Error("No guess provided");
  }

  const player_id = req.body.player_id;

  if ( ! player_id ) {
    throw new Error("No player ID provided");
  } else if ( !parseInt(player_id) ) {
    throw new Error("Invalid player ID provided");
  }

  return Round.guess({ game_id, id: round_id }, { id: player_id }, guess);
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

module.exports.guess = {
  path: '/:game_id/rounds/:round_id/guess',
  method: 'post',
  fn: guess
};
