'use strict';
//var Promise = require('bluebird');
var req = require('./req');
var sequence = require('./sequence');
var _ = require('lodash');

var setup = function(arr) {
  if ( !_.isArray(arr) ) {
    arr = [arr];
  }

  return sequence(arr.map(function(a, i) {
    var player = a.player;
    var msg = a.msg;
    if ( ! player ) {
      console.error(a, i);
      throw "No player provided";
    }
    if ( ! msg ) {
      console.error(a, i);
      throw "No msg provided";
    }
    return function() {
      return req.post({
        player: player,
        message: msg
      }, null, true);
    };
  }));
};

module.exports = setup;
