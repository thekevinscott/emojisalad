'use strict';
const squel = require('squel').useFlavour('mysql');
const db = require('db');
const Promise = require('bluebird');
const User = require('models/user');
const _ = require('lodash');
const api = require('config/services').api.url;
//let Game;
const req = Promise.promisify(require('request'));
const request = function(options) {
  return req(options).then(function(response) {
    //console.log('re', response);
    let body = response.body;
    try {
      body = JSON.parse(body);
    } catch(err) {}

    if ( body ) {
      return body;
    } else {
      throw new Error('No response from API in player');
    }
  });
}

let Player = {
  // create a new player
  create: (params) => {
    return request({
      url: `${api}players`,
      method: 'POST',
      form: {
        to: params.to,
        from: params.from
      }
    }).then((response) => {
      if ( response.id ) {
        return response;
      } else {
        throw response;
      }
    });
  },
  getOne: function(params) {
    return request({
      url: `${api}players`,
      method: 'GET',
      qs: params
    }).then(function(response) {
      if ( response && response.length ) {
        return response[0];
      } else {
        return null;
      }
    });
  },
  update: (player, params) => {
    return request({
      url: `${api}players/${player.id}`,
      method: 'PUT',
      form: {
        state: params.state
      }
    }).then((response) => {
      if ( response.id ) {
        return response;
      } else {
        throw response;
      }
    });
  },
};

module.exports = Player;
