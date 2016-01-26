'use strict';
//const router = require('routes');
const Phone = require('models/phone');
const Player = require('models/player');
const User = require('models/user');
const Twilio = require('models/twilio');
const Promise = require('bluebird');
const req = Promise.promisify(require('request'));

module.exports = Promise.coroutine(function* (params) {
  console.debug('\n==========process message===========\n');
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

  let player = yield Player.getOne({
    from: params.from,
    to: params.to
  });

  if ( !player ) {
    // does a user exist?
    const user = yield User.getOne({
      from: params.from
    });

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
  //let response = yield router(player, params.body, params.to);
  //console.debug('response', response);
  const parsed_response = yield Message.parse(response);
  //console.debug('parsed response', parsed_response);
  return parsed_response;
});
