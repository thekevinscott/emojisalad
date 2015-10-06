'use strict';
//const _ = require('lodash');
//const Promise = require('bluebird');
//const setup = require('../lib/setup');
const signup = require('./signup');
const invite = require('./invite');
const sequence = require('../lib/sequence');
const getGame = require('../lib/getGame');
const setNonRandomGame = require('../lib/setNonRandomGame');

function startGame(users) {
  return signup(users[0]).then(function() {
    // this sets a game to not be random.
    // we need this set so we know // which clues to expect
    return setNonRandomGame(users[0]);
  }).then(function() {
    // make sure to sign people up in sequence, so we know
    // in what order to expect messages
    return sequence(users.slice(1).map(function(user) {
      return function() {
        return invite(users[0], user); 
      };
    }));
  }).then(function() {
    return getGame(users[0]);
  });
}

module.exports = startGame;
