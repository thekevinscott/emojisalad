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
  console.debug('\n================twilio=================\n');
  if ( ! message.from ) {
    throw new Error("No from provided");
  }
  if ( ! message.to ) {
    throw new Error("No to provided");
  }
  if ( ! message.body ) {
    throw new Error("No body provided");
  }
  const params = {
    from: message.from,
    to: message.to,
    body: message.body,
  };
  console.debug(params.from, params.body, params.to);

  try {
    let player = yield Player.get({
      from: message.from,
      to: message.to
    });

    if ( !player ) {
      // does a user exist?
      const user = yield User.get({
        from: message.from
      });

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
    }
    console.debug([
      'player.id: ' + player.id,
      'player.nickname: ' + player.nickname,
      'from: ' + params.from,
      'body: ' + params.body,
      'player.state: ' + player.state,
    ].join(' | '));

    let response = yield router(player, params.body, params.to);
    return yield Message.parse(response);
  } catch(err) {
    pmx.notify(err);
  }
});
