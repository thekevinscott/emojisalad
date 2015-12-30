'use strict';
//const Promise = require('bluebird');
const req = require('./req');
const sequence = require('./sequence');
const _ = require('lodash');

function setup(arr) {
  if ( !_.isArray(arr) ) {
    arr = [arr];
  }

  return sequence(arr.map(function(a, i) {
    const player = a.player;
    const msg = a.msg;
    const to = a.to;
    if ( ! player ) {
      console.error(a, i);
      throw "No player provided";
    }
    if ( ! msg ) {
      console.error('index', i, 'array', arr);
      throw "No msg provided";
    }
    return function() {
      return req({
        player: player,
        message: msg,
        to: to
      }, true);
    };
  }));
}

module.exports = setup;
