'use strict';
//const Promise = require('bluebird');
//const Player = require('models/player');
const Invite = require('models/invite');
const User = require('models/user');
const Phone = require('models/phone');
const Email = require('models/email');
//const _ = require('lodash');
const rule = require('config/rule');

module.exports = (player, message) => {
  let existing_user;
  let parsed_invitee;
  console.info('message', message);
  let invited_string = rule('invite').match(message);
  if ( ! invited_string ) {
    invited_string = message;
  }
  console.info('invitee', invited_string);

  return Phone.parse(invited_string).then((response) => {
    console.info('response from attempting to parse the phone response', response);
    if ( ! response || ! response.phone ) {
      console.info('not a valid phone');
      // this means its not a valid phone. is it a valid email?
      return Email.parse(invited_string).then((response) => {
        console.info('email parse response', response);
        if ( ! response || ! response.email ) {
          // not a valid email either.
          // because our majority use case is sms,
          // alert the user that the phone number was invalid
          throw new Error(`Problem parsing phone number: ${JSON.stringify(response)} ${message}`);
        } else {
          return {
            protocol: 'mail',
            from: response.email
          };
        }
      });
    } else {
      console.info('it is a valid phone');
      return {
        protocol: player.protocol || 'sms',
        from: response.phone
      };
    }
  }).then((invitee) => {
    //parsed_invitee = invitee;
    //invites[0] = invited_string;
    //const payload = {
      //from: invited_string
    //};
    console.info('user payload', invitee);
    return User.get(invitee).then((users) => {
      console.info('found users', users);
      if ( users.length ) {
        existing_user = users.pop();
      }
    }).then(() => {
      return Invite.create(player, invitee);
    });
  //}).then(() => {
    //console.info('creat invite');
  }).then((invite) => {
    console.info('back, invites', invite);
    if ( invite.error ) {
      //console.error('invite error is found', player, message, invite);
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
              invited_string
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
        //console.info('invite', invite);
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
  }).catch(() => {
    // Problem parsing phone number or email
    return [
      {
        player,
        key: 'error-4',
        options: [invited_string]
      }
    ];
  });

};
