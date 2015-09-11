var _ = require('lodash');
var Promise = require('bluebird');
var setup = require('../lib/setup');
var signup = require('./signup');
var invite = require('./invite');
var setNonRandomGame = require('../lib/setNonRandomGame');

function startGame(users) {
  return signup(users[0]).then(function() {
    return Promise.all(users.slice(1).map(function(user) {
      return invite(users[0], user); 
    }));
  }).then(function() {
    // this sets a game to not be random.
    // we need this set so we know
    // which clues to expect
    return setNonRandomGame(users[0]);
  });
}

module.exports = startGame;
