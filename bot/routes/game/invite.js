'use strict';
//const Promise = require('bluebird');
//const Player = require('models/player');
const Invite = require('models/invite');
const User = require('models/user');
const Phone = require('models/phone');
//const _ = require('lodash');
const rule = require('config/rule');

module.exports = (player, message) => {
  let invited_string;
  let existing_user;
  //console.log('message', message);
  let number = rule('invite').match(message);
  if ( ! number ) {
    number = message;
  }
  //console.log('number', number);

  return Phone.parse(number).then((response) => {
    //console.log('response', response);
    if ( response && response.phone ) {
      invited_string = response.phone;
      number = invited_string;
      //console.log('number', number);
      //invites[0] = invited_string;
      const payload = {
        from: invited_string
      };
      console.info('user payload', payload);
      return User.get(payload).then((users) => {
        console.info('found users', users);
        if ( users.length ) {
          existing_user = users.pop();
        }
      });
    } else {
      //console.log('error in invite');
      //console.error('error parsing phone', response, message);
      throw new Error(`Problem parsing phone number: ${JSON.stringify(response)} ${message}`);
    }
  }).then(() => {
    //console.log('creat invite');
    return Invite.create(player, [ number ]);
  }).then((invites) => {
    //console.log('back, invites', invites);
    if ( invites.error ) {
      console.error(player, message, invites);
      throw new Error("Invite Create was called incorrectly");
    } else {
      const invite = invites[0] || { error: 'No invite found' };
      if ( invite.error ) {
        console.info('there is an invite error', invite);
        switch ( invite.code ) {
        case 1200:
          // Invite already exists
          return [
            {
              player,
              key: 'error-2',
              options: [invited_string]
            }
          ];
          break;
        case 1202:
          // Invite already exists
          return [
            {
              player,
              key: 'error-3',
              options: [invited_string]
            }
          ];
          break;
        case 1203:
          // Cannot invite yourself
          return [
            {
              player,
              key: 'error-16',
              options: []
            }
          ];
          break;
        case 1204:
          // Invited user playing maximum games
          return [
            {
              player,
              key: 'error-12'
            }
          ];
          break;
        case 1205:
          // Invited user is already in the game
          return [
            {
              player,
              key: 'error-15',
              options: [
                number
              ]
            }
          ];
          break;
        default:
          return [
            {
              player,
              key: 'error-4',
              options: [invited_string]
            }
          ];
          break;
        }
      } else {
        if ( existing_user ) {
          //console.log('invite', invite);
          return [
            {
              player: invite.inviter_player,
              key: 'intro_existing_player',
              options: [invited_string]
            },
            {
              key: 'invite_existing_player',
              options: [
                existing_user.nickname,
                existing_user.avatar,
                invite.inviter_player.nickname,
                invite.inviter_player.avatar
              ],
              player: invite.invited_user
            }
          ];
        } else {
          return [
            {
              player: invite.inviter_player,
              key: 'intro_5',
              options: [invited_string]
            },
            {
              key: 'invite',
              options: [
                invite.inviter_player.nickname,
                invite.inviter_player.avatar
              ],
              player: invite.invited_user
            }
          ];
        }
      }
    }
  }).catch(() => {
    //console.error('err', err);
    // Invite already exists
    return [
      {
        player,
        key: 'error-4',
        options: [invited_string]
      }
    ];
  });

};
