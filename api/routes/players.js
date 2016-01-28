'use strict';
const express = require('express');
const Player = require('models/player');

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
    path: '/:player_id',
    method: 'get',
    fn: find 
  },

];

//playersRouter.route('/').get(index);
//playersRouter.route('/').post(create);
//playersRouter.route('/:player_id').get(find);
//playersRouter.route('/:player_id').delete(remove);
//playersRouter.route('/:player_id').put(update);

function find(req) {
  return Player.findAll(req.query);
}
function findOne(req) {
  const player_id = req.params.player_id;
  if ( ! player_id ) {
    throw "No player ID provided, how is that possible?";
  } else if ( !parseInt(player_id) ) {
    throw "Invalid player ID provided";
  }
  return Player.findOne(player_id);
}
function create(req) {
  return Player.create(req.body);
}
