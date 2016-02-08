'use strict';
//const _ = require('lodash');
//const Promise = require('bluebird');
//const setup = require('../lib/setup');
const signup = require('./signup');
const invite = require('./invite');
const sequence = require('../lib/sequence');
const getGame = require('../lib/getGame');
const setNonRandomGame = require('../lib/setNonRandomGame');

function startGame(players) {
  return signup(players[0]).then(function() {
    // this sets a game to not be random.
    // we need this set so we know // which clues to expect
    return setNonRandomGame(players[0]);
  }).then(function() {
    // make sure to sign people up in sequence, so we know
    // in what order to expect messages
    return sequence(players.slice(1).map(function(player) {
      return function() {
        return invite(players[0], player); 
      };
    }));
  }).then(function() {
    return getGame(players[0]);
  });
}

module.exports = startGame;
