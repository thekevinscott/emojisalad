'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const Promise = require('bluebird');
const api = require('config/services').api.url;

const req = Promise.promisify(require('request'));
const request = function(options) {
  return req(options).then(function(response) {
    let body = response.body;
    try {
      body = JSON.parse(body);
    } catch(err) {}

    if ( body ) {
      return body;
    } else {
      throw new Error('No response from API');
    }
  });
}

const User = {
  create: function (params) {
    return request({
      url: `${api}users`,
      method: 'POST',
      form: params
    });
  },
  update: function (user, params) {
    return request({
      url: `${api}users/${user.id}`,
      method: 'PUT',
      form: params
    });
  },
  getPlayersNum: Promise.coroutine(function* (params) {
    console.log('**** THIS SHOULD BE MOVED TO GET GAMES');
    throw '1';
    let query = squel
                .select()
                .field('count(1) as players')
                .from('users', 'u')
                .left_join('players', 'p', 'p.user_id=u.id')
                ;

    if ( params.id ) {
      query = query.where('u.id=?',params.id);
    }
    
    if ( params.from ) {
      query = query.where('u.`from`=?',params.from);
    }

    let rows = yield db.query(query.toString());
    if ( rows.length ) {
      return rows[0].players;
    } else {
      return null;
    }
  }),
  getOne: function (params) {
    return request({
      url: `${api}users`,
      method: 'GET',
      qs: params
    }).then(function(response) {
      if ( response ) {
        return response[0];
      } 
    });
  },
};

module.exports = User;
