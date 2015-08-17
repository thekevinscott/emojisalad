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
  create: function(number, state, inviter_number, entry) {
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

      if ( inviter_number ) {
        promises.push(function() {
          var inviter_id = squel
                           .select()
                           .field('id')
                           .from('users')
                           .where('number=?', inviter_number);

          return db.query(inviter_id).then(function(inviter_id) {
            if ( inviter_id.length ) {
              inviter_id = inviter_id[0].id;
              query.set('inviter_id', inviter_id);
            } else {
              throw "This should never happen - the user who invited this phone is not in databse" + inviter_id;
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

      if ( state ) {
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
      }

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
                .from('texts', 't')
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
        return null;
      }
    });
  },
  updatePhone: function(number, user) {
    if ( number !== user.number ) {
      var query = squel
                  .update()
                  .table('users')
                  .set('number', number)
                  .where('id=?',user.id);

      return db.query(query);
    }
  },
  updateNickname: function(nickname, number) {
    var query = squel
                .update()
                .table('users')
                .set('nickname', nickname)
                .where('number=?', number);

    return db.query(query);
  },
  get: function(user) {
    var dfd = Q.defer();
    function fetchUser(key, val) {
      var query = squel
                  .select()
                  .field('u.id')
                  .field('u.number')
                  .field('u.nickname')
                  .field('u.created')
                  .field('u.inviter_id')
                  .field('i.number', 'inviter_number')
                  .from('users', 'u')
                  .left_join('users', 'i', 'i.id = u.inviter_id')
                  .where('u.`'+key+'`=?', val);
      db.query(query.toString()).then(dfd.resolve).fail(dfd.reject);
    }
    if ( typeof user === 'object' ) {
      // then we've passed a user object
      if ( user.id ) {
        fetchUser('id', user.id);
      } else {
        fetchUser('number', user.number);
      }
    } else {
      // we've passed a number
      fetchUser('number', user);
    }
    return dfd.promise;
  },
  // return the new user created
  invite: function(msg, invitingUserNumber) {
    console.log('invite');
    if ( ! Text || ! Text.send ) {
      Text = require('./text');
    }
    var invitedNumber = msg.split('invite ').pop();
    return Q.allSettled([
      User.create(invitedNumber, 'invited', invitingUserNumber, 'text_invite'),
      User.get(invitingUserNumber)
    ]).spread(function(invitedUserPromise, invitingUserPromise) {
      /* 
       * invitedUser { state: 'fulfilled', value: { id: 116, number: '4126382398' } }
       * invitingUser { state: 'fulfilled',
       *   value:
       *      [ { id: 109,
       *             number: '+18604608183',
       *                    nickname: 'Kevin',
       *                           created: Sun Aug 16 2015 11:30:00 GMT-0400 (EDT) } ] }
       *                           */
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
        return Text.send(invitedUser, 'invite', [ invitingUser.nickname ]).fail(function(err) {
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
  }
};

module.exports = User;
