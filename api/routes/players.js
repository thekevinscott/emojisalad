'use strict';
const express = require('express');
const Player = require('models/player');

module.exports = [
  {
    path: '/',
    method: 'get',
    fn: index
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

function index(req) {
  let params = {};
  return Player.findAll(params);
}
function find(req) {
  return Player.get({ id: req.param('player_id')});
}
function create(params) {
  return Player.create(params);
}
