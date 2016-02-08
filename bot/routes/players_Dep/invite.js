'use strict';
const Promise = require('bluebird');
//const Phone  = require('models/phone');
const Invite = require('models/invite');
const rule = require('config/rule');

module.exports = Promise.coroutine(function* (inviter, input) {
  if ( rule('new-game').test(input) ) {
    return require('../games/new-game')(inviter, input);
  } else if ( rule('invite').test(input) ) {
    //var type = 'twilio';
    input = input.split('invite').pop().trim();
    try {
      let players = yield Invite.create(inviter, input);
      //console.log('players', players);
      console.log('players', players.invited_player);
      // let the inviting player know we messaged
      // their buddy, and let the buddy
      // know they've been invited
      if ( players.invited_player.state === 'invited-to-new-game' ) {
        return [
          {
            player: players.inviting_player,
            key: 'intro_existing_player',
            options: [input]
          },
          {
            key: 'invite_existing_player',
            options: [players.invited_player.nickname, players.inviting_player.nickname],
            player: players.invited_player
          },
        ];
      } else if ( players.invited_player.state === 'waiting-for-confirmation' ) {
        return [
          {
            player: players.inviting_player,
            key: 'intro_5',
            options: [input]
          },
          {
            key: 'invite',
            options: [
              players.inviting_player.nickname,
              players.inviting_player.number,
            ],
            player: players.invited_player
          },
        ];
      } else {
        console.error(players);
        throw "Unsupported state for invited player";
      }

    } catch(error) {
      if ( error && parseInt(error.message) ) {
        return [{
          player: inviter,
          key: 'error-'+error.message,
          options: [input]
        }];
      } else {
        console.error('HANDLE THIS', error.message);
        throw error;
      }
    }
  } else {
    return [{
      player: inviter,
      key: 'error-8',
      options: [input]
    }];
  }

});
