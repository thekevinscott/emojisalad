// a separate router. all routes come in to platforms which then routes them here.
'use strict';

let Promise = require('bluebird');
let Player = require('models/player');
let User = require('models/user');

let Router = function(from, message, to) {
  return new Promise((resolve) => {
    resolve([{
      key: 'intro',
      player: {
        from: from,
        to: to
      }
    },
    //{
      //key: 'intro',
      //player: {
        //from: '123123123',
        //to: '989899898' 
      //}
    //}
    ]);
  });



  return Player.getOne({
    from: from,
    to: to
  }).then((player) => {
    if ( player ) {
      // this means we are in a game
    } else {
      // this means we are either brand new,
      // or being onboarded
      return User.getOne({
        from: from
      }).then((user) => {
        // if user exists, we are being onboarded
        if ( user ) {
          // append the number the user has messaged to the user object.
          // Any valid game number will maintain the same conversation
          user.to = to;
          return require('./onboarding')(user, message);
        } else {
          return require('./create-user')(from, message, to);
        }
      });
    }
  });
};

module.exports = Router;
