'use strict';
const Promise = require('bluebird');
//const Player = require('models/player');
const Invite = require('models/invite');
const Phone = require('models/phone');
const _ = require('lodash');
const rule = require('config/rule');

module.exports = (player, message) => {
  let invited_string;
  // TODO: Figure out how to parse numbers better
  const invites = rule('invite').match(message).split(' **** ');

  //const invited_string = invites[0];

  return Phone.parse({ number: invites[0] }).then((response) => {
    if ( response && response.number ) {
      invited_string = response.number;
      invites[0] = invited_string;
      return Invite.create(player, invites);
    } else {
      console.error('error parsing phone', response, message);
      throw new Error("Problem parsing phone number");
    }
  }).then((invites) => {
    if ( invites.error ) {
      console.error(player, message, invites);
      throw new Error("Invite Create was called incorrectly");
    } else {
      let invite = invites[0] || { error: 'No invite found' };
      if ( invite.error ) {
        console.info('there is an invite error', invite);
        switch ( invite.code ) {
        case 1200:
          // Invite already exists
          return [
            {
              player: player,
              key: 'error-2',
              options: [invited_string]
            },
          ];
          break;
        case 1202:
          // Invite already exists
          return [
            {
              player: player,
              key: 'error-3',
              options: [invited_string]
            },
          ];
          break;
        default:
          return [
            {
              player: player,
              key: 'error-4',
              options: [invited_string]
            },
          ];
          break;
        }
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
          },
        ];
      }
    }
  });

  /*
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
  */
};

