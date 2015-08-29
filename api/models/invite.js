var Q = require('q');
var squel = require('squel');

var db = require('db');

var Phone = require('./phone');
var User;
var Text = require('./text');
var Message = require('./message');
var Game = require('./game');

var Invite = {
  create: function(type, value, invitingUser) {
    if ( ! User ) {
      User = require('./user');
    }

    switch(type) {
      case 'twilio':
        return Phone.parse(value).then(function(number) {
          // first check to see if user exists
          return User.get({ number: number }).then(function(user) {
            if ( user ) {
              switch( user.state ) {
                case 'do-not-contact': 
                  throw new Error(3);
                  break;
                default:
                  throw new Error(2);
                  break;
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
          var invite_id;
          var query = squel
                      .insert()
                      .into('invites')
                      .set('invited_id', invitedUser.id)
                      .set('inviter_id', invitingUser.id);
        
          return db.query(query).then(function(rows) {
            invite_id = rows.insertId;
          }).then(function() {
            return {
              id: invite_id,
              invited_user: invitedUser,
              inviting_user: invitingUser
            };
          });
        });
        break;
    }
  },
};

module.exports = Invite;
