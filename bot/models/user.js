'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const Promise = require('bluebird');

const api = require('../api');

const User = {
  create: (params) => {
    return api('users', 'create', params);
  },
  update: (user, params) => {
    return api('users', 'update', params, { user_id: user.id });
  },
  //getPlayersNum: Promise.coroutine(function* (params) {
    //return 0;
    //console.log('**** THIS SHOULD BE MOVED TO GET GAMES');
    //throw '1';
    //let query = squel
                //.select()
                //.field('count(1) as players')
                //.from('users', 'u')
                //.left_join('players', 'p', 'p.user_id=u.id')
                //;

    //if ( params.id ) {
      //query = query.where('u.id=?',params.id);
    //}
    
    //if ( params.from ) {
      //query = query.where('u.`from`=?',params.from);
    //}

    //let rows = yield db.query(query.toString());
    //if ( rows.length ) {
      //return rows[0].players;
    //} else {
      //return null;
    //}
  //}),
  get: function (params) {
    return api('users', 'get', params);
  },
  //getOne: function (params) {
    //return api('users', 'getOne', params);
  //},
};

module.exports = User;
