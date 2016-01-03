'use strict';
const router = require('routes');
const Phone = require('models/phone');
const Player = require('models/player');
const User = require('models/user');
const Message = require('models/message');
const Twilio = require('models/twilio');
const Promise = require('bluebird');
module.exports = Promise.coroutine(function* (params) {
  console.debug('\n================twilio=================\n');
  console.debug(params);
  if ( ! params.from ) {
    throw new Error("No from provided");
  }
  if ( ! params.to ) {
    throw new Error("No to provided");
  }
  if ( ! params.body ) {
    throw new Error("No body provided");
  }

  let player = yield Player.get({
    from: params.from,
    to: params.to
  });
  console.debug('player', player);

  if ( !player ) {
    // does a user exist?
    const user = yield User.get({
      from: params.from
    });
    console.debug('user', user);

    if ( user ) {
      player = {
        state: 'uncreated',
        user_id: user.id,
        to: params.to,
        //number: user.from,
        user: user
      };
    } else {
      player = {
        from: params.from,
        state: 'uncreated',
      };
    }
  }

  console.debug([
    'player.id: ' + player.id,
    'player.nickname: ' + player.nickname,
    'from: ' + params.from,
    'body: ' + params.body,
    'player.state: ' + player.state,
  ].join(' | '));

  console.debug('get ready to call router');
  let response = yield router(player, params.body, params.to);
  //console.debug('response', response);
  const parsed_response = yield Message.parse(response);
  //console.debug('parsed response', parsed_response);
  return parsed_response;
});
