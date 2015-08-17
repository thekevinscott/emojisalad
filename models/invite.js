var Q = require('q');
var squel = require('squel');

var db = require('db');

var Invite = {
  create: function(type, value, user) {
    var dfd = Q.defer();
    var acceptedTypes = [
      'twilio'
    ];
    if ( acceptedTypes.indexOf(type) === -1 ) {
      dfd.reject('not an accepted type of invite');
    }
    switch(type) {
      case 'twilio':
        value = value.split('invite').pop();
        Phone.parse(value).then(function(number) {

          return User.create(invitedNumber, 'invited', 'text_invite');
        }).then(function(invitedUser) {
          var query = squel
                      .insert()
                      .into('invites')
                      .set('invited_id', invitedUser.id)
                      .set('inviter_id', user.id);
        
          return db.query(query).then(function() {
            return invitedUser;
          });
        }).then(function(invitedUser) {
          return User.send(invitedUser, 'invite', [ invitingUser.username ]);
        }).fail(function(err) {
          if ( err === 'Phone number is already registered' ) {
            throw "Phone number has already been invited";
          } else {
            throw err;
          }
        });
        break;
    }
    return dfd.promise;
  }
};

module.exports = Invite;
