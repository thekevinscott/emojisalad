'use strict';
const express = require('express');
const Player = require('models/player');

module.exports = [
  {
    path: '/',
    method: 'get',
    fn: find 
  },
  //{
    //path: '/',
    //method: 'post',
    //fn: create
  //},
  {
    path: '/:player_id',
    method: 'get',
    fn: findOne
  },
  //{
    //path: '/:player_id',
    //method: 'put',
    //fn: update
  //},
  //{
    //path: '/:player_id',
    //method: 'delete',
    //fn: remove 
  //},
];

//playersRouter.route('/').get(index);
//playersRouter.route('/').post(create);
//playersRouter.route('/:player_id').get(find);
//playersRouter.route('/:player_id').delete(remove);
//playersRouter.route('/:player_id').put(update);

function find(req) {
  console.log('player find', req.query);
  return Player.find(req.query);
}
function findOne(req) {
  console.log('player find one');
  const player_id = req.params.player_id;
  if ( ! player_id ) {
    throw "No player ID provided, how is that possible?";
  } else if ( !parseInt(player_id) ) {
    throw "Invalid player ID provided";
  }
  return Player.findOne(player_id);
}
//function create(req) {
  //return Player.create(req.body);
//}
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
