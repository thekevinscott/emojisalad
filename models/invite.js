var Q = require('q');
var squel = require('squel');

var db = require('db');

var Phone = require('./phone');
var User = require('./user');

var Invite = {
  create: function(type, value, user) {
    console.log('create an invite');
    var dfd = Q.defer();
    var acceptedTypes = [
      'twilio'
    ];
    if ( acceptedTypes.indexOf(type) === -1 ) {
      dfd.reject('not an accepted type of invite');
    }
    var invitingUser = user;
    switch(type) {
      case 'twilio':
        value = value.split('invite').pop();
        console.log('value', value);
        Phone.parse(value).then(function(number) {
          console.log('number parsed', number);
          return User.create(number, 'text_invite', 'twilio');
        }).then(function(invitedUser) {
          console.log('created new user', invitedUser);
          var invite_id;
          var query = squel
                      .insert()
                      .into('invites')
                      .set('invited_id', invitedUser.id)
                      .set('inviter_id', invitingUser.id);
        
                      console.log('perpare to insert query');
          return db.query(query).then(function(rows) {
            invite_id = rows.insertId;
            console.log('got the invited user', invitedUser);
            // inform the invited user that they've been invited
            return User.message(invitedUser, 'invite', [ invitingUser.username ]);
          }).then(function() {
            console.log('told the invited user they invited');
            // inform the inviting user their buddy has been invited
            return User.message(invitingUser, 'intro_4', [ invitedUser.number ]);
          }).then(function() {
            // all done!
            dfd.resolve({
              id: invite_id,
              invited_user: invitedUser,
              inviting_user: invitingUser
            });
          });
        }).fail(function(err) {
          console.log('err', err);
          if ( err && err.errno ) {
            switch(err.errno) {
              case 1: // invalid number
                User.message(invitingUser, 'error-'+err.errno, [ value ]);
                break;
              case 2: // phone number already has been invited
                User.message(invitingUser, 'error-'+err.errno, [ value ]);
                break;
              case 3: // user is on do-not-call list
                User.message(invitingUser, 'error-'+err.errno, [ value ]);
                break;
              case 6: // user is unverified
                User.message(invitingUser, 'error-'+err.errno, [ value ]);
                break;
            }
            dfd.reject({ error: err.message });
          } else {
            dfd.reject(err);
          }
        });
        break;
    }
    return dfd.promise;
  }
};

module.exports = Invite;
