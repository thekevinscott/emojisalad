'use strict';
var Phone  = require('models/phone');
var Invite = require('models/invite');
var rule = require('config/rule');

module.exports = function(invitingPlayer, input, to) {
  if ( rule('invite').test(input) ) {
    var type = 'twilio';
    input = input.split('invite').pop().trim();
    return Phone.parse([input]).then(function(phones) {
      let phone = phones[0];
      return Invite.create(type, phone, invitingPlayer, to).then(function(invite) {
        return {
          invitedPlayer: invite.invited_player,
          invitingPlayer: invite.inviting_player,
        };
      }).then(function(players) {
        // let the inviting player know we messaged
        // their buddy, and let the buddy
        // know they've been invited
        return [
          {
            player: players.invitingPlayer,
            key: 'intro_4',
            options: [phone]
          },
          {
            key: 'invite',
            options: [players.invitingPlayer.nickname],
            player: players.invitedPlayer
          },
        ];
      });
    }).catch(function(error) {
      if ( error && parseInt(error.message) ) {
        return [{
          player: invitingPlayer,
          key: 'error-'+error.message,
          options: [input]
        }];
      } else {
        console.error('HANDLE THIS', error.message);
        throw error;
      }
    });
  } else {
    return [{
      player: invitingPlayer,
      key: 'error-8',
      options: [input]
    }];
  }

};
