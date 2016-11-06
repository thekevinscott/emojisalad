// a separate router. all routes come in to platforms which then routes them here.
'use strict';

//const Promise = require('bluebird');
const Player = require('models/player');
const User = require('models/user');
const Challenge = require('models/challenge');

const Router = ({ game_key, from, message, to, protocol }) => {
  console.info(`===========Router Index: ${message} | ${from} | ${to} | ${protocol} ${game_key}`);
  return Player.get({
    game_key,
    from,
    to,
    protocol,
  }).then((players) => {
    console.info('players', players);
    if (players.length > 1) {
      console.error('players', players);
      throw new Error('Incorrect player retrieval, should not get more than 1');
    } else if (players.length === 1) {
      const player = players.shift();
      //console.debug('Make sure to check blacklisted status here');
      if ( player.blacklist ) {
        console.info('blacklisted player', player);
        return;
      } else {
        console.info('send to game');
        //console.info('send to game', player, message);
        return require('./game')(player, message);
      }
      // this means we are in a game
    } else {
      // this means we are either brand new,
      // or being onboarded
      console.info(`prepare to get users by from, ${from}, ${protocol}`);
      return User.get({
        from,
        protocol,
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
            return require('./onboarding')({
              user,
              message,
            });
          }
        } else {
          // This might be a challenge request - a user texting
          // a number they found on the street with an answer.
          //
          // Check to see if the number has an associated challenge
          // with it.
          console.info('prepare to get challenge', to, protocol);
          return Challenge.get({
            sender_id: to,
            protocol,
          }).then(phrases => {
            /*
            console.info('phrases back', phrases);
            if (phrases && phrases.length > 0) {
              const phrase = phrases.shift();
              return require('./challenge')({
                user: {
                  from,
                  to,
                  protocol,
                },
                message,
                phrase,
              });
            }
            */

            // otherwise, create a user normally
            console.info('create user');
            return require('./create-user')(from, message, to, protocol);
          });
        }
      });
    }
  });
};

module.exports = Router;
