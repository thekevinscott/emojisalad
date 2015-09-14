'use strict';
//var User = require('../../models/user');
//var Message = require('../../models/message');
var Phone  = require('../../models/phone');
var Invite = require('../../models/invite');
//var Promise = require('bluebird');
var rule = require('../../config/rule');

module.exports = function(invitingUser, input) {
  if ( rule('invite').test(input) ) {
    var type = 'twilio';
    input = input.split('invite').pop().trim();
    return Phone.parse(input).then(function(phone) {
      return Invite.create(type, phone, invitingUser).then(function(invite) {
        return {
          invitedUser: invite.invited_user,
          invitingUser: invite.inviting_user,
        };
      }).then(function(users) {
        // let the inviting user know we messaged
        // their buddy, and let the buddy
        // know they've been invited
        return [
          {
            user: users.invitingUser,
            key: 'intro_4',
            options: [phone]
          },
          {
            key: 'invite',
            options: [users.invitingUser.nickname],
            user: users.invitedUser
          },
        ];
      });
    }).catch(function(error) {
      if ( error && parseInt(error.message) ) {
        return [{
          user: invitingUser,
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
      user: invitingUser,
      key: 'error-8',
      options: [input]
    }];
  }

};
