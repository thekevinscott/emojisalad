var User = require('../../models/user');
var Message = require('../../models/message');
var Phone  = require('../../models/phone');
var Invite = require('../../models/invite');
var Promise = require('bluebird');

module.exports = function(invitingUser, input) {
  if ( /^invite(.*)/.test(input) ) {
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
        return Promise.join(
          Message.get('intro_4', phone),
          Message.get('invite', users.invitingUser.nickname),
          function(sentMessage, invitedMessage) {
            sentMessage.type = 'respond';
            invitedMessage.type = 'sms';
            invitedMessage.number = users.invitedUser.number;
            return [
              sentMessage,
              invitedMessage
            ];
          }
        );
      });
    }).catch(function(error) {
      if ( error && parseInt(error.message) ) {
        return Message.get('error-'+error.message, [input]).then(function(message) {
          message.type = 'respond';
          return [message];
        });
      } else {
        console.error('HANDLE THIS', error.message);
        throw error;
      }
    });
  } else {
    return Message.get('error-8').then(function(message) {
      message.type = 'respond';
      return [message];
    });
  }

}
