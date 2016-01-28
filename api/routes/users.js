'use strict';
const express = require('express');
const User = require('models/user');

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
    path: '/:user_id',
    method: 'get',
    fn: findOne
  },
  {
    path: '/:user_id',
    method: 'put',
    fn: update 
  },
  {
    path: '/:user_id',
    method: 'delete',
    fn: remove 
  },

];

function find(data = {}) {
  return User.find(data);
}
function findOne(data, params) {
  const user_id = params.user_id;
  if ( ! user_id ) {
    throw "No user ID provided, how is that possible?";
  } else if ( !parseInt(user_id) ) {
    throw "Invalid user ID provided";
  }
  return User.findOne(user_id);
}
function create(data = {}) {
  return User.create(data);
}
function update(params, data) {
  const user_id = data.user_id;
  return User.update({ id: user_id }, params);
}
function remove(params, data) {
  const user_id = data.user_id;
  if ( ! user_id ) {
    throw "No user ID provided, how is that possible?";
  } else if ( !parseInt(user_id) ) {
    throw "Invalid user ID provided";
  }
  return User.remove(user_id);
}
