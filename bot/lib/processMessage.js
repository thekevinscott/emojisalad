'use strict';
const pmx = require('pmx');
const router = require('routes');
const Phone = require('models/phone');
const Player = require('models/player');
const User = require('models/user');
const Message = require('models/message');
const Twilio = require('models/twilio');
const Promise = require('bluebird');
module.exports = Promise.coroutine(function* (message) {
  const params = {
    from: message.from,
    to: message.to,
    body: message.body,
  };
  console.debug('\n================twilio=================\n');
  console.debug(params.from, params.body, params.to);

  const body = params.body;

  // first, we parse the Phone number
  return Phone.parse([params.from, params.to]).then(function(parsed_numbers) {
    const from = parsed_numbers[0];
    const to = parsed_numbers[1];
    return Player.get({ from: from, to: to }).then(function(player) {
      if ( !player ) {
        // does a user exist?
        return User.get({ from: from }).then(function(user) {
          if ( user ) {
            return {
              state: 'uncreated',
              user_id: user.id,
              to: to,
              //number: user.from,
              user: user
            };
          } else {
            return {
              number: from,
              state: 'uncreated',
            };
          }
        });
      } else {
        return player;
      }
    }).then(function(player) {
      console.debug([
        'player.id: ' + player.id,
        'player.nickname: ' + player.nickname,
        'from: ' + params.from,
        'body: ' + params.body,
        'player.state: ' + player.state,
      ].join(' | '));
      if ( !to || to[0] !== '+' ) {
        console.error('to', params.body.to);
        throw "STOP";
      }
      return router(player, body, params.to);
    });
  }).then(function(response) {
    return Message.parse(response);
  //}).then(function(response) {
    //return response;
  }).catch(function(err) {
    console.error('twilio error for ', params);
    console.error(err.stack);
    if ( err.sql ) {
      console.error(err.sql);
    }
    console.error(err);

    pmx.notify(err);
  });
});
