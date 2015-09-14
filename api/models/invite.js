'use strict';
const squel = require('squel');
const db = require('db');
const Phone = require('./phone');
const User = require('./user');

let Invite = {
  create: function(type, value, invitingUser) {
    if ( type === 'twilio' ) {
      return Phone.parse(value).then(function(number) {
        // first check to see if user exists
        return User.get({ number: number }).then(function(user) {
          if ( user ) {
            switch( user.state ) {
              case 'do-not-contact': 
                throw new Error(3);
              default:
                throw new Error(2);
            }
            //throw new Error({
              //message: 'User already exists',
              //errno: 2
            //});
          } else {
            return User.create({ number: number },
                               'text_invite', type);
          }
        });
      }).then(function(invitedUser) {
        let query = squel
                    .insert()
                    .into('invites')
                    .set('invited_id', invitedUser.id)
                    .set('inviter_id', invitingUser.id);
      
        return db.query(query).then(function(rows) {
          return {
            id: rows.insertId,
            invited_user: invitedUser,
            inviting_user: invitingUser
          };
        });
      });
    }
  },
};

module.exports = Invite;
