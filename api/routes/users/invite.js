var User = require('../../models/user');
//var Message = require('../../models/message');
var Phone  = require('../../models/phone');
var Invite = require('../../models/invite');
var Promise = require('bluebird');

module.exports = function(invitingUser, input) {
  if ( /^invite(.*)/i.test(input) ) {
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
            type: 'respond',
            key: 'intro_4',
            options: [phone]
          },
          {
            type: 'sms',
            key: 'invite',
            options: [users.invitingUser.nickname],
            user: users.invitedUser
          },
        ];
        //return Promise.join(
          //Message.get('intro_4', phone),
          //Message.get('invite', users.invitingUser.nickname),
          //function(sentMessage, invitedMessage) {
            //sentMessage.type = 'respond';
            //invitedMessage.type = 'sms';
            //invitedMessage.number = users.invitedUser.number;
            //return [
              //sentMessage,
              //invitedMessage
            //];
          //}
        //);
      });
    }).catch(function(error) {
      if ( error && parseInt(error.message) ) {
        return [{
          type: 'respond', 
          key: 'error-'+error.message,
          options: [input]
        }];
        //return Message.get('error-'+error.message, [input]).then(function(message) {
          //message.type = 'respond';
          //return [message];
        //});
      } else {
        console.error('HANDLE THIS', error.message);
        throw error;
      }
    });
  } else {
    return [{
      type: 'respond', 
      key: 'error-8',
      options: [input]
    }];
    //return Message.get('error-8').then(function(message) {
      //message.type = 'respond';
      //return [message];
    //});
  }

}
