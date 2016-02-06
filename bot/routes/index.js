// a separate router. all routes come in to platforms which then routes them here.
'use strict';

let Promise = require('bluebird');
let Player = require('models/player');
let User = require('models/user');

let Router = function(from, message, to) {
  return Player.get({
    from: from,
    to: to
  }).then((players) => {
    if ( players.length  ) {
      console.debug('we  are in a game');
      // this means we are in a game
    } else {
      // this means we are either brand new,
      // or being onboarded
      return User.get({
        from: from
      }).then((users) => {
        console.debug('users back', users);
        console.debug('hallelujah');
        console.debug(users.length);
        // if user exists, we are being onboarded
        if ( users.length ) {
          console.debug('proceed to onboarding');
          const user = users.shift();
          // append the number the user has messaged to the user object.
          // Any valid game number will maintain the same conversation
          user.to = to;
          return require('./onboarding')(user, message);
        } else {
          console.debug('create user');
          return require('./create-user')(from, message, to);
        }
      });
    }
  });
};

module.exports = Router;
