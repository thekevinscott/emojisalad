var _ = require('lodash');
var Promise = require('bluebird');
var setup = require('../lib/setup');
var signup = require('./signup');
var invite = require('./invite');
var sequence = require('../lib/sequence');
var setNonRandomGame = require('../lib/setNonRandomGame');

function startGame(users) {
  return signup(users[0]).then(function() {
    // make sure to sign people up in sequence, so we know
    // in what order to expect messages
    return sequence(users.slice(1).map(function(user) {
      return function() {
        return invite(users[0], user); 
      }
    }));
  }).then(function() {
    // this sets a game to not be random.
    // we need this set so we know
    // which clues to expect
    return setNonRandomGame(users[0]);
  });
}

module.exports = startGame;
