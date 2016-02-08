// a separate router. all routes come in to platforms which then routes them here.
'use strict';

let Promise = require('bluebird');
let Player = require('models/player');
let User = require('models/user');

let Router = function(from, message, to) {
  console.info('I am from the Bot');
  return Player.get({
    from: from,
    to: to
  }).then((players) => {
    if ( players.length  ) {
      console.log('Make sure to check blacklisted status here');
      console.info('we are in a game');
      // this means we are in a game
    } else {
      // this means we are either brand new,
      // or being onboarded
      console.info('prepare to get dem users');
      return User.get({
        from: from
      }).then((users) => {
        //console.info('users back', users);
        // if user exists, we are being onboarded
        if ( users.length ) {
          console.info('proceed to onboarding');
          const user = users.shift();
          // append the number the user has messaged to the user object.
          // Any valid game number will maintain the same conversation
          user.to = to;
          if ( user.blacklist ) {
            return;
          } else {
            return require('./onboarding')(user, message);
          }
        } else {
          console.info('create user');
          return require('./create-user')(from, message, to);
        }
      });
    }
  });
};

module.exports = Router;
