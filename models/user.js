var Q = require('q');
var squel = require('squel');

var db = require('db');
var Message = require('./message');
var Text;

var regex = require('../config/regex');

var User = {
  // valid phone number test
  table: 'users',

  // create a new user number
  create: function(number, state, entry, platform) {
    var dfd = Q.defer();

    if ( ! number ) {
      dfd.reject('You must provide a phone number');
    //} else if ( !regex('phone').test(number) ) {
      //console.log('number', number, 'failed regex');
      //dfd.reject('You must provide a valid phone number');
    } else {
      var user = {
        number: number,
      };

      var promises = [];

      if ( platform ) {
        promises.push(function() {
          var platform_id = squel
                           .select()
                           .field('id')
                           .from('platforms')
                           .where('platform=?', platform);

          return db.query(platform_id).then(function(platform_id) {
            if ( platform_id.length ) {
              platform_id = platform_id[0].id;
              query.set('platform_id', platform_id);
            } else {
              throw "Platform does not exist " + platform;
            }
          });
        }());
      }

      if ( entry ) {
        promises.push(function() {
          var entry_id = squel
                         .select()
                         .field('id')
                         .from('user_entries')
                         .where('entry=?', entry);
          return db.query(entry_id).then(function(entry_id) {
            if ( entry_id.length ) {
              console.log('we have an entry id');
              entry_id = entry_id[0].id;
              query.set('entry_id', entry_id);
            } else {
              throw "Desired entry " + entry + " is not in the database";
            }
          });
        }());
      }

      var query = squel
                  .insert()
                  .into(this.table)
                  .setFields(user);

      if ( ! state ) {
        state = 'waiting-for-confirmation';
      } 
      promises.push(function() {
        var user_state = squel
                         .select()
                         .field('id')
                         .from('user_states')
                         .where('state=?',state);
        return db.query(user_state).then(function(state_id) {
          if ( state_id.length ) {
            state_id = state_id[0].id;
            query.set('state_id', state_id);
          }
        });
      }());

      Q.allSettled(promises).spread(function() {
        db.query(query).then(function(rows) {
          dfd.resolve({
            id: rows.insertId,
            number: user.number
          });
        }).fail(function(err) {
          switch(err.errno) {
            case 1062:
              dfd.reject('Phone number is already registered');
            break;
            default: 
              console.error('error registering phone number', err);
            dfd.reject('There was an unknown error registering the phone number. Please try again later');
            break;
          }
        });
      });
    }
    return dfd.promise;
  },
  lastStep: function(number, skip) {
    var query = squel
                .select()
                .field('m.key')
                .from('outgoingMessages', 't')
                .left_join('messages', 'm', 't.message_id = m.id')
                .left_join('users', 'u', 'u.id = t.user_id')
                .where('u.number = ?', number)
                .order('t.created', false)

    return db.query(query).then(function(steps) {
      if ( steps.length ) {
        if ( ! skip || ! skip.length ) {
          return steps[0].key;
        } else {
          for ( var i=0;i<steps.length;i++ ) {
            if ( skip.indexOf(steps[i].key) === -1 ) {
              return steps[i].key;
            }
          }
          return 'No last step found that was excluded by skip';
        }
      } else {
        console.log(query.toString());
        return null;
      }
    });
  },
  getSingle: function(user) {
    return this.get(user).then(function(users) {
      if ( users.length ) {
        return users[0];
      } else {
        return null;
      }
    });
  },
  get: function(user) {
    var dfd = Q.defer();
    function fetchUser(key, val) {
      var query = squel
                  .select()
                  .field('u.id')
                  .field('u.number')
                  .field('u.username')
                  .field('u.created')
                  .field('i.inviter_id')
                  .field('p.platform', 'platform')
                  .field('s.state', 'state')
                  .from('users', 'u')
                  .left_join('invites', 'i', 'u.id = i.invited_id')
                  .left_join('platforms', 'p', 'p.id = u.platform_id')
                  .left_join('user_states', 's', 's.id = u.state_id')
                  .where('u.`'+key+'`=?', val);
      db.query(query.toString()).then(dfd.resolve).fail(dfd.reject);
    }
    if ( typeof user === 'object' ) {
      // then we've passed a user object
      if ( user.id ) {
        fetchUser('id', user.id);
      } else if ( user.number ) {
        fetchUser('number', user.number);
      }
    } else {
      // we've passed a number
      fetchUser('number', user);
    }
    return dfd.promise;
  },
  // return the new user created
   /*
  invite: function(msg, invitingUserNumber) {
    console.log('invite');
    if ( ! Text || ! Text.send ) {
      Text = require('./text');
    }
    var invitedNumber = msg.split('invite ').pop();
    return Q.allSettled([
      User.create(invitedNumber, 'invited', 'text_invite'),
      User.get(invitingUserNumber)
    ]).spread(function(invitedUserPromise, invitingUserPromise) {
       //* invitedUser { state: 'fulfilled', value: { id: 116, number: '4126382398' } }
       //* invitingUser { state: 'fulfilled',
       //*   value:
       //*      [ { id: 109,
       //*             number: '+18604608183',
       //*                    username: 'Kevin',
       //*                           created: Sun Aug 16 2015 11:30:00 GMT-0400 (EDT) } ] }
       //*                           
      if ( invitedUserPromise.state === 'rejected' ) {
        switch(invitedUserPromise.reason) {
          case 'Phone number is already registered' :
            throw {
              key: 'already_invited',
              data: [invitedNumber]
            };
            break;
          default:
            throw invitedUserPromise.reason
            break;
        }
      } else {

        var invitedUser = invitedUserPromise.value;
        var invitingUser = invitingUserPromise.value[0];
        // add an entry in the invited table
        var invited_query = squel
                            .insert()
                            .into('invites')
                            .set('invited_id', invitedUser.id)
                            .set('inviter_id', invitingUser.id);
        db.query(query);

        console.log('invitingUser', invitingUser);
        return Text.send(invitedUser, 'invite', [ invitingUser.username ]).fail(function(err) {
          console.log('err back from twilio, process this', err);
          throw err.message;
        }).then(function(response) {
          //return invitedUser;
          return {
            invitedUser: invitedUser,
            invitingUser: invitingUser
          };
        });
      }
    });
  },
  */
 /*
  notifyInviter: function(invitedUser) {
    var query = squel
                .select()
                .from('invites', 'i')
                .left_join('users', 'u', 'u.id = i.inviter_id')
                .where('i.invited_id=?',invitedUser.id);

    db.query(query).then(function(users) {
      if ( users.length ) {
        var invitingUser = users[0];
        Text.send(invitingUser, 'intro_4', [ invitedUser.number ]);
      } else {
        throw "wtf, there should be a amtching user who invited the other user";
      }
    });
  },
  */
  update: function(user, params) {
    return this.getSingle(user).then(function(user) {
      if ( user ) {
        return Q.resolve(user);
      } else {
        return Q.reject('no user found for user id ' + user_id);
      }
    }).then(function(user) {
      // a whitelisted array of arguments we're allowed to update
      var whitelist = [
        'username',
        'state'
      ];

      var query = squel
                  .update()
                  .table('users')
                  .where('id=?', user.id);

      Object.keys(params).filter(function(key) {
        if ( whitelist.indexOf(key) !== -1 ) {
          return true;
        }
      }).map(function(key) {
        switch(key) {
          case 'state' :
            var state = squel
                         .select()
                         .field('id')
                         .from('user_states')
                         .where('state=?',params[key]);

            query.set('state_id', state, { dontQuote: true });
            break;
          default:
            console.log('update ',key );
            query.set(key, params[key]);
            break;
        }
      });

      return db.query(query).then(function(rows) {
        return user;
      });
    }).fail(function(err) {
      console.error('db error', err);
    });
  },
  // set a user's status to onboarded being true
  updateState: function(state, number) {
    var user_state = squel
                     .select()
                     .field('id')
                     .from('user_states')
                     .where('state=?',state);

    var query = squel
                .update()
                .table('users')
                .set('state_id', user_state, { dontQuote: true })
                .where('number=?', number);

    return db.query(query);
  },
  // check to see if a user has completed onboarding
  onboarded: function(number) {
    var query = squel
                .select()
                .field('s.state')
                .from('users', 'u')
                .left_join('user_states', 's', 's.id = u.state_id')
                .where('u.number=?', number);

    return db.query(query.toString()).then(function(state) {
      if ( state !== 'created' && state !== 'invited' ) {
        return true;
      } else {
        return false;
      }
    });
  },
  message: function(user, message, options) {
    switch(user.platform) {
      case 'twilio':
        if ( ! Text || ! Text.send ) {
          Text = require('./text');
        }
        return Text.send(user.number, message, options);
        break;
    }
  }
};

module.exports = User;
