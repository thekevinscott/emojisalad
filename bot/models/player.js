'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const Promise = require('bluebird');
const User = require('models/user');
const _ = require('lodash');
const api = require('../api');

let Player = {
  // create a new player
  create: (params) => {
    return api('players', 'create', {
      to: params.to,
      from: params.from
    }); 
  },
  get: function(params) {
    return api('players', 'get', params);
  }
  //getOne: function(params) {
    //return api('players', 'get', params);
  //}
};

module.exports = Player;
